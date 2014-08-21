/**
* @fileoverview Sets up the Triangular Backend and kicks it off.
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

var KOA = require('koa');

// -------------------------------------------------------------------------------------------------
// TRIANGULAR MIDDLEWARE PACKAGES
// -------------------------------------------------------------------------------------------------

var BodyParser = require('koa-body-parser');
var KOAJson = require('koa-json');
var RedisSession = require('koa-session-redis');
var Auth = require('koa-passport');
var Flash = require('koa-flash');

var TriangularViews = require('./../hooks/views/views');
var TriangularViewsPathParser = require('./../hooks/views/viewPathParser');
var TriangularControllerAutoDiscoverer = require('./../core/controllers/controllersBuilder');
var TriangularAuthentication = require('./../hooks/authentication/setup');
var TriangularStartupInfo = require('./utils/printStartupInfo');

// -------------------------------------------------------------------------------------------------
// TRIANGULAR HOOKS
// -------------------------------------------------------------------------------------------------

// @private {object:Router} The application automated routing
var TriangularRouteBuilder = require('../hooks/routing/routeBuilder');

// @private {object:ModelBuilder} The application automated model generator
var TriangularModelBuilder = require('../hooks/models/modelBuilder');

// -------------------------------------------------------------------------------------------------
// TRIANGULAR SETUP
// -------------------------------------------------------------------------------------------------

module.exports = {

  start: function (app, cb) {

    TA.Q.spawn(function* () {

      // -------------------------------------------------------------------------------------------------
      // PREP TRIANGULAR
      // -------------------------------------------------------------------------------------------------

      var triangularBase = KOA();

      // Add Triangular App to ctx
      triangularBase.use(function* (next) {
        this.triangularApp = app;
        yield next;
      });

      // -------------------------------------------------------------------------------------------------
      // ADD BODY PARSING
      // -------------------------------------------------------------------------------------------------

      triangularBase.use(BodyParser());

      // -------------------------------------------------------------------------------------------------
      // SETUP REDIS SESSIONS
      // -------------------------------------------------------------------------------------------------

      // Setup session based on project session configuration file
      var sessionConfig = require(TA.appConfig + 'session');

      // Set app keys
      triangularBase.keys = sessionConfig.session.keys;

      // Use redis configuration based on app mode
      triangularBase.use(RedisSession(sessionConfig.session[TA.mode].store));

      // -------------------------------------------------------------------------------------------------
      // ADD FLASH
      // -------------------------------------------------------------------------------------------------

      triangularBase.use(Flash());

      // -------------------------------------------------------------------------------------------------
      // ADD BODY JSON OUTPUT
      // -------------------------------------------------------------------------------------------------

      triangularBase.use(KOAJson());

      // -------------------------------------------------------------------------------------------------
      // TRIANGULAR MODELS SETUP
      // -------------------------------------------------------------------------------------------------

      // Create model builder
      var modelBuilder = new TriangularModelBuilder();

      // Add Shared Models
      TA.models = yield modelBuilder.configSetup();

      // -------------------------------------------------------------
      // SETUP PASSPORT AUTHENTICATION
      // -------------------------------------------------------------

      triangularBase.use(Auth.initialize());
      triangularBase.use(Auth.session());
      TriangularAuthentication(Auth);
      TA.auth = Auth;

      // -------------------------------------------------------------------------------------------------
      // TRIANGULAR CONTROLLERS & ACTIONS AUTO DISCOVER
      // -------------------------------------------------------------------------------------------------

      var controllerActions = TriangularControllerAutoDiscoverer();

      // -------------------------------------------------------------------------------------------------
      // ADD VIEWS
      // -------------------------------------------------------------------------------------------------

      // Determines View Path
      triangularBase.use(TriangularViewsPathParser);

      // Sets up triangular views & templates
      triangularBase.use(TriangularViews('views', {
        default: app.viewEngine,
        cache: app.cacheViews
      }));

      // -------------------------------------------------------------------------------------------------
      // TRIANGULAR ROUTING HOOK SETUP
      // -------------------------------------------------------------------------------------------------

      // Create App Router
      var appRouteBuilder = new TriangularRouteBuilder(triangularBase);

      // Sets up automated routing via configuration and controllers
      appRouteBuilder.setupControllerRouting();

      // -------------------------------------------------------------------------------------------------
      // TRIANGULAR STARTUP
      // -------------------------------------------------------------------------------------------------

      triangularBase.listen(app.port);

      // Print startup info
      TriangularStartupInfo(app.name, app.port);

      // Pass back the triangular application from the run method
      cb({
        base: triangularBase,
        router: appRouteBuilder,
        controllerActions: controllerActions
      });

    }); // START PROMISE

  } // START

} // EXPORTS


