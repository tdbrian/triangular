/**
* @fileoverview Handles connection to MongoDB and Mongoose setup
* application.
*
* @author <tdbrian@gmail.com> (Thomas Brian)
* @version 0.0.1 2014-08-07 <tdbrian@gmail.com> (Thomas Brian)

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

// @public {object:Klass} Handles creating classes in Triangular
var klass = require('klass');

// @public {object:Mongoose} Used for mongoDB object relation mapping
var Mongoose = require('mongoose');

// -------------------------------------------------------------------------------------------------
// The Connection class
// @return {void}
// -------------------------------------------------------------------------------------------------

// @private {object} Reference to this class
var self;

// @public {object:TriangularFramework} The Triangular Framework Object
var MongoConnection = klass({

  // @public {object:MongooseConnection} The database connection
  db: {},

  // --------------------------------------------------------------------------------
  // Initialize mongodb connection
  // @param {object} DB connection settings
  // @return {void}
  // --------------------------------------------------------------------------------

  initialize: function (connectionSettings) {

    // Set self to this class
    self = this;

    // @public {object} DB connection settings
    this.connectionSettings = connectionSettings;

  },

  // --------------------------------------------------------------------------------
  // Connects to the Mongo Database with given settings
  // @return {void}
  // --------------------------------------------------------------------------------

  connect: function (cb) {

    // Makes the Mongoose database connection
    Mongoose.connect('mongodb://' + this.connectionSettings.host + '/' +
      this.connectionSettings.database + '');

    // Assign pending connection
    this.db = Mongoose.connection;

    // Respond on database connection
    this.db.on('error', this.onDBError);

    // Respond on database connection open
    this.db.on('open', function () {
      cb();
    });

  },

  // --------------------------------------------------------------------------------
  // On an error with the database connection
  // @param {object:Error} DB connection error
  // @return {void}
  // --------------------------------------------------------------------------------

  onDBError: function (err) {
    TA.logger.error(err);
  }

});

// -------------------------------------------------------------------------------------------------
// MODULE EXPORT
// -------------------------------------------------------------------------------------------------

module.exports = MongoConnection;


