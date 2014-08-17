
/**
* @fileoverview TriangularJS is a full stack application framworking
* inucluding database (MonogDB), server (Koa), api, and front-end
* (AngularJS) all tied together with generators and model based API.
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
// TRIANGULAR SERVER REQUIREMENTS
// -------------------------------------------------------------------------------------------------

var Klass = require('klass');

// -------------------------------------------------------------------------------------------------
// The Triangular class.
// @return {void}
// -------------------------------------------------------------------------------------------------

var Triangular = Klass({

  initialize: function(appConfig) {

    // @public {string} The application name
    this.name = appConfig.name;

    // @public {number} Application port
    this.port = appConfig.port;

    // @public {string} Application templating engine
    this.viewEngine = appConfig.viewEngine;

    // @public {string} Application templating engine caching
    this.cacheViews = appConfig.cacheViews;

    // @public {object} The underlying base application
    this.base = {};

    // @public {object} App router
    this.router = {};

    // @public {object} Controller Actions
    this.controllerActions = {};

    // Runs startup on the app
    this.setup();

  },

  // -------------------------------------------------------------------------------------------------
  // Starts up Triagnular
  // @return {void}
  // -------------------------------------------------------------------------------------------------

  setup: function() {

    // -------------------------------------------------------------------------------------------------
    // TRIANGULAR STARTUP
    // -------------------------------------------------------------------------------------------------

    var self = this;

    // Startup triangular and get the startup parts
    require('./startup.js').start(this, function (triangularParts) {
      self.base = triangularParts.base;
      self.router = triangularParts.appRouter;
      self.controllerActions = triangularParts.controllerActions;
    });

  }

});

// -------------------------------------------------------------------------------------------------
// MODULE EXPORT
// -------------------------------------------------------------------------------------------------

module.exports = Triangular;

