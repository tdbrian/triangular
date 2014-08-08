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

var KOA                 = require('koa');                   // KOA Framework
var BodyParser          = require('koa-body-parser');       // Handles parsing post bodies
var Colors              = require('colors');                // Allow showing colors

// -------------------------------------------------------------------------------------------------
// APPLICATION SPECIFIC CONFIG
// -------------------------------------------------------------------------------------------------

var appConfig           = require('../../config/app');      // Application specific properties
var db                  = require('../../config/db');       // Database specific properties

// -------------------------------------------------------------------------------------------------
// TRIANGULAR SETUP
// -------------------------------------------------------------------------------------------------

exports.module = {

  run = function () {

    // Setup Koa
    var triangular = KOA();

    // Set Triangular Properties
    triangular.triangular = {};
    triangular.triangular.name = appConfig.name;

    // The request body parser
    triangular.use(BodyParser());

    // The route parser
    triangular.use(Router(triangular));

    // -------------------------------------------------------------------------------------------------
    // TRIANGULAR STARTUP
    // -------------------------------------------------------------------------------------------------

    triangular.listen(appConfig.port);
    console.log('BES+Tech API Server Running ON'.green + ' http://localhost:3812'.yellow);

    return triangular;

  }

}


