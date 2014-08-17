
/**
* @fileoverview Adds view path properties to the application
* to be run.
*
* @author <tdbrian@gmail.com> (Thomas Brian)
* @version 0.0.1 2014-08-15 <tdbrian@gmail.com> (Thomas Brian)

MIT License
===========

Copyright (c) 2014 Thomas Brian <tdbrian@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
DEALINGS IN THE SOFTWARE.

**/

// -------------------------------------------------------------------------------------------------
// TRIANGULAR SERVER REQUIREMENTS
// -------------------------------------------------------------------------------------------------

var PathToRegexp = require('path-to-regexp');
var Path = require('path');

// --------------------------------------------------------------------------------
// Parses the view path and determines the controller and run function
// --------------------------------------------------------------------------------

module.exports = function *viewPathParser (next) {

  var self = this;

  var possibleRoutes = this.app.routes;

  TA._.forIn(possibleRoutes, function (routeInfo, routePath) {

    var keys = [];
    var re = PathToRegexp(routePath, keys);
    var matchResult = re.exec(self.url);

    // If matching route found
    if(matchResult) {

      // Set view path for matching route
      var primaryViewFolder = routeInfo.controller.replace('Controller','').toLowerCase();
      var fileBase = routeInfo.fnName.toLowerCase();

      // Remove verb/verbs from filebase
      if(fileBase.indexOf('_') > -1) {
        fileBase = fileBase
        .replace('get_', '')
        .replace('post_', '')
        .replace('put_', '')
        .replace('delete_', '')
      };

      // Save view base for automated view routing later
      self.viewBase = primaryViewFolder + '/' + fileBase;

      // Stop loop
      return false;
    }

  });

  yield next;

};




