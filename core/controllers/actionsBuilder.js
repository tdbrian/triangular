
/**
* @fileoverview Builds out a list of available application actions.
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

// --------------------------------------------------------------------------------
// Gets all controller actions from the controller
// @param {function} Controller to get the actions from
// @param {string} The name of the controller
// @return {array} Array of actions for the given controller
// --------------------------------------------------------------------------------

module.exports = function (controller, controllerName) {

  // The array of actions to return
  var actions = {};

  // Create a route for each controller
  TA._.forEach(controller, function (controllerFunctions, fnName) {

    var verb;           // The function verb
    var name;           // The function name
    var path;           // The path to the function route

    // Check if function name includes verb
    if (fnName.indexOf('_') > -1) {
      var fnParts = fnName.split('_');
      verb = fnParts[0].toLowerCase();
      name = fnParts[1].toLowerCase();
    } else {
      // console.log('setting default get...');
      verb = 'get';
      name = fnName;
    }

    // Create route path
    var modControllerName = controllerName.replace('Controller', '').toLowerCase();
    var path = '/' + modControllerName + '/' + name;

    // Set action signature for later referencing
    var actionSignature = controllerName + '.' + fnName;

    // Save route
    actions[actionSignature] = {
      verb: verb,
      path: path,
      fnName: fnName,
      controller: controllerName
    };

  });

  return actions;

};

