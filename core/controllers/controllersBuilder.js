
/**
* @fileoverview Builds out a list of available application controllers.
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

var ActionsBuilder = require('./actionsBuilder');
var FS = require('fs');
var Path = require('path');

// --------------------------------------------------------------------------------
// Gets all available controllers
// @return {type} description
// --------------------------------------------------------------------------------

module.exports = function () {

  var allControllerActions = {};

  // Get controller config & router directories
  var controllersDirectory = Path.join(process.cwd(), 'api', 'controllers');

  // Get all controllers in the controllers directory
  FS.readdirSync(controllersDirectory).forEach(function(file) {

    // Get controller and added to loaded controllers
    var controller = require(Path.join(process.cwd(), "api", "controllers", file));

    // Strip controller extension
    var controllerName = file.substr(0, file.lastIndexOf('.')) || file;

    var controllerActions = ActionsBuilder(controller, controllerName);

    // Adds in new actions
    allControllerActions = TA._.assign(allControllerActions, controllerActions);

  });

  return allControllerActions;

};

