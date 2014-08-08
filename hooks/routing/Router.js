/**
* @fileoverview Handles all triagnular routing and automated routing.
* application.
*
* @author <tdbrian@gmail.com> (Thomas Brian)
* @version 0.0.1 2014-08-06 <tdbrian@gmail.com> (Thomas Brian)

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
// TRIANGULAR ROUTER REQUIREMENTS
// -------------------------------------------------------------------------------------------------

var FS                  = require("fs");                    // File system access
var KOARouter           = require('koa-router');            // Application Routing
var Resource            = require('koa-resource-router');   // Handles Resource Routing
var Mount               = require('koa-mount');             // For mounting KOA middleware
var Path                = require('path');                  // Used for getting file paths

// -------------------------------------------------------------------------------------------------
// MODULE EXPORT
// -------------------------------------------------------------------------------------------------

module.exports = Router;

// -------------------------------------------------------------------------------------------------
// The router class.
// @param {object} The triangular application to attach the routing to.
// @return {void}
// -------------------------------------------------------------------------------------------------

function Router (triangular) {

  // @public {object:Triangular} // The triangular application to add the routing to
  this.triangularAPP = triangular;

  // @public {object:RoutesCollection} // API versioning Routes indexed by name
  this.routeAPIVersions = {};

  // @public {object:Strings} // All setup application routes
  this.triangularAPP.routes = {};

  // @public {object:Strings} // All automatically loaded controllers & routing
  this.loadedControllers = {};

}

// -------------------------------------------------------------------------------------------------
// Add API versioning mount
// @param {string} The name of the router which can used later for reference.
// @return {void}
// -------------------------------------------------------------------------------------------------

Router.prototype.addAPIVersionMount = function(name) {

  // Create route with name
  var newKOARouter = new KOARouter();
  this.triangularAPP.use(mount(('/' + name), newKOARouter.middleware()));

  // Add to the Triangular Router versions
  this.routeAPIVersions[name] = newKOARouter;

}

// -------------------------------------------------------------------------------------------------
// Add base routing mounting
// @param {string} The base routing mount '/'
// to ensure the API routes are used before the base routing.
// @return {void}
// -------------------------------------------------------------------------------------------------

Router.prototype.addBaseMount = function() {

  // Create route with name
  var baseKOARouter = new KOARouter();
  this.triangularAPP.use(mount(baseKOARouter.middleware()));

  // Add to the Triangular Router versions
  this.routeAPIVersions.base = baseKOARouter;

}

// -------------------------------------------------------------------------------------------------
// Adds automated controller routing to the application
// @param {}
// @return {void}
// -------------------------------------------------------------------------------------------------

Router.prototype.setupControllerRouting = function() {

  var self = this;
  var controllersDirectory = Path.join(process.cwd(), 'api', 'controllers');

  FS.readdirSync(controllersPath).forEach(function(file) {

    // Get controller and added to loaded controllers
    var controller = require("./api/controllers/" + file);

    // Strip controller extension
    var controllerName = file.substr(0, file.lastIndexOf('.')) || file;

    // Add to loaded controllers for access later
    self.loadedControllers[controllerName] = controller;

    // Create a route for each controller
    _.forEach(controller, function (controllerFunctions, fnName) {

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
      // console.log('modified controller name:', modControllerName);
      var path = '/' + modControllerName + '/' + name;
      // routePaths.push[] = ;

      // Create route
      try {
        triangularAPP[verb](path, controller[fnName]);
      } catch (err) {
        throw new Error('Route function ' + fullname + ' setup error.');
      }

    })

  });

  // Add each route from config routes
  _.forEach(Routes, function (routePair, path) {

    var pathParts;                    // The parts of the path from the route config 'post /hello'
    var verb;                         // The route config verb (get, post, put, remove)
    var path;                         // The URL path '/hello'
    var definedVerb = false           // Specifies if route verb was defined

    // If a space in the path, the first part is expected to be the route verb
    if (path.indexOf(' ') > -1) {
      pathParts = path.split(' ');
      verb = pathParts[0];
      path = pathParts[1];
      definedVerb = true;

    // Default no verb to a get
    } else {
      verb = 'get';
    }

    // Expecting route pair to contain a '.' to split the controller and function
    // Notify if not the correct format for routing
    if (routePair.indexOf('.') > -1) {

      // Get controller combo parts (controller and function names)
      var controllerCombo = routePair.split('.');

      // Available controller functions
      var availableFn = _.keys(self.loadedControllers[controllerCombo[0]])
      var fnName;

      // Check if there is a controller function with same verb
      if (verb == 'get' && _.contains(availableFn, 'get_' + controllerCombo[1])) {
        fnName = 'get_' + controllerCombo[1];

      // If the verb was defined, only us a function with ver defined
      } else if (definedVerb && _.contains(['post', 'put', 'delete'], verb)) {
        fnName = verb + '_' + controllerCombo[1]

      // If verb not defined.. and no matching 'get_' then set to original name
      } else {
        fnName = controllerCombo[1];
      }

      var routeFunction = self.loadedControllers[controllerCombo[0]][fnName];

    } else {
      throw new Error('Controller for route ' + path + ' in router.js is incorrect format');
    }

    // Attempt to setup route
    try {
      self.triangularAPP[verb](path, routeFunction);
      // routePaths.push()
    } catch (err) {
      console.log(err);
      throw new Error('Controller and function for ' + verb + ' route "' + path + '" in router.js ' +
        'does not exist');
    }

  });

}



