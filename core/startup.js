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
var BodyParser = require('koa-body-parser');
var FS = require('fs');

// -------------------------------------------------------------------------------------------------
// TRIANGULAR HOOKS
// -------------------------------------------------------------------------------------------------

// @private {object:Router} The application automated routing
var TriangularRouter = require('../hooks/routing/router');

// @private {object:ModelBuilder} The application automated model generator
var TriangularModelBuilder = require('../hooks/models/modelBuilder');

// -------------------------------------------------------------------------------------------------
// TRIANGULAR SETUP
// -------------------------------------------------------------------------------------------------

module.exports = {

  start: function (app) {

    // -------------------------------------------------------------------------------------------------
    // PREP TRIANGULAR
    // -------------------------------------------------------------------------------------------------

    var triangularBase = KOA();

    // -------------------------------------------------------------------------------------------------
    // ADD BODY PARSING
    // -------------------------------------------------------------------------------------------------

    triangularBase.use(BodyParser());

    // -------------------------------------------------------------------------------------------------
    // TRIANGULAR ROUTING HOOK SETUP
    // -------------------------------------------------------------------------------------------------

    // Create App Router
    var appRouter = new TriangularRouter(triangularBase);

    // Sets up automated routing via configuration and controllers
    appRouter.setupControllerRouting();

    // -------------------------------------------------------------------------------------------------
    // TRIANGULAR MODELS SETUP
    // -------------------------------------------------------------------------------------------------

    // Create model builder
    var modelBuilder = new TriangularModelBuilder();

    // Add Shared Models
    modelBuilder.setupShared();

    // Add Server Models
    modelBuilder.setupServer();

    // -------------------------------------------------------------------------------------------------
    // TRIANGULAR STARTUP
    // -------------------------------------------------------------------------------------------------

    triangularBase.listen(app.port);

    // Get Artwork
    var art = FS.readFileSync(process.cwd() + '/node_modules/triangular/config/triangularArt.txt',
      'utf8');

    // Get Version
    var triangularVersion = require('./../package.json').version;
    var VERSION_NAME = 'Sullust';

    // Framework Details
    console.log(art.yellow.bold);
    console.log("Fully Operational Vertical Stack Framework Featuring KOA, MongoDB & AngularJS"
      .yellow.bold, ' (v'.yellow.bold + triangularVersion.yellow.bold,
      VERSION_NAME.yellow.bold + ')'.yellow.bold);
    console.log('c2014 Authors: Thomas Brian & Brenton Gillis'.grey);
    console.log('REPO: https://github.com/tdbrian/triangular'.grey);
    console.log('Released Under MIT Open Source License'.grey);
    console.log('');

    console.info( app.name.green + ' Running ON'.green + ' http://localhost:'.yellow +
      String(app.port).yellow);

    console.log('');

    // Pass back the triangular application from the run method
    return {
      base: triangularBase,
      router: appRouter
    };

  }

}


