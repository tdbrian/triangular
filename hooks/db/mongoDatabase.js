/**
* @fileoverview Manages the Mongo and Mongoose Database Objects
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
// TRIANGULAR DATABASE REQUIREMENTS
// -------------------------------------------------------------------------------------------------

// @public {object:Klass} Handles creating classes in Triangular
var klass = require('klass');

// -------------------------------------------------------------------------------------------------
// TRIANGULAR DATABASE CLASS
// -------------------------------------------------------------------------------------------------

// @private {object} Reference to this class
var self;

// @public {object:TriangularFramework} The Triangular Framework Object
var MongoDatabase = klass ({

  // @public {object:Connection} Manages the DB Connection
  connection: {},

  initialize: function (dbConfig) {

    // @public {object:Mongoose} Used for mongoDB object relation mapping
    this.Mongoose = require('mongoose');

    // Set self to this class
    self = this;

    // @private {config} Database Configuration
    this._dbConfig = dbConfig;

    // @public {string} Database Name
    this.name = dbConfig.name;

    // @public {string} Indicates if db should be connected and added to DBs
    this.active = dbConfig.active;

  },

  // --------------------------------------------------------------------------------
  // Connects database
  // @return {void}
  // --------------------------------------------------------------------------------

  connect: function (cb) {

    var connectionSettings = this._dbConfig[TA.mode];

    // @public {object:MongoConnection} Class Manages the database connection
    var MongoConnection = require('./mongoConnection');

    // Crreate connection
    this.connection = new MongoConnection(connectionSettings);

    // Attempt connect
    this.connection.connect(function() {
      var connectionNotification = self.name+' Database Connection Made in mode: '+TA.mode;
      console.log(connectionNotification.green);
      cb();
    })

  }

});

// -------------------------------------------------------------------------------------------------
// MODULE EXPORT
// -------------------------------------------------------------------------------------------------

module.exports = MongoDatabase;


