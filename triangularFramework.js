
/**
* @fileoverview Triangular Framework sets up the framework globals and kicks off one or more
* Triangular Apps based on project configuration.
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
// TRIANGULAR FRAMEWORK REQUIREMENTS
// -------------------------------------------------------------------------------------------------

// @private {object} Handles creating classes in Triangular
var klass = require('klass');

// @private {object} Handles setting up and managing Triangular global namespace (TA)
var globalsManager = require('./core/globals');

// @private {object:Triangular} The Triangular App Class
var Triangular = require('./core/triangular');

// @private {object:MongoDatabase} The Triangular MongoDatabase Class handles connection to mongodB
var MongoDatabase = require('./hooks/db/mongoDatabase');

// -------------------------------------------------------------------------------------------------
// TRIANGULAR FRAMEWORK CLASS
// -------------------------------------------------------------------------------------------------

// @private {object} Reference to this class
var _self;

// @public {object:TriangularFramework} The Triangular Framework Object
var TriangularFramework = klass({

  // --------------------------------------------------------------------------------
  // Initializes the framework by creating the globals manager and triangular apps
  // variable to track all created apps in the TA namespace.
  // --------------------------------------------------------------------------------

  initialize: function () {

    // Set self to this class
    _self = this;

    // Setup triangular framework globals
    globalsManager.setupDefault();

    // @global {array} Stores all of the framework applications
    TA.apps = [];

    // @global {array} Stores all of the framework database connections
    TA.connections = [];

    // Setup app(s) based on project apps configuration file
    var projectConfig = require(TA.appConfig + 'project').project;

    // @global {string} The project name
    TA.name = projectConfig.name;

    // @global {string} The project name
    TA.mode = projectConfig.mode;

    // Setup app(s) based on project apps configuration file
    var appsConfig = require(TA.appConfig + 'apps').apps;

    // Connect project databases
    this.connectDatabases();

    // Setup each triangular app
    TA._.each(appsConfig, function (appConfig) {

      // Add new application based on passed app configuration
      _self.addApp(appConfig);

    });

    // Listens for process to exit and cleans up framework before shutting down
    this._listenFramworkClose();

  },

  // --------------------------------------------------------------------------------
  // Connects to project database(s). CURRENTLY ON MONGO DB IS SUPPORTED! ADDITONAL
  // DB SUPPORT MAY BE ADDED HERE AT A FUTURE DATE.
  // @return {void}
  // --------------------------------------------------------------------------------

  connectDatabases: function () {

    // Setup app(s) based on project apps configuration file
    var dbsConfig = require(TA.appConfig + 'databases');

    // Setup each database
    TA._.each(dbsConfig, function (databaseConfig) {

      // Initiated Database
      var db;

      // Select DB based on config type
      switch(databaseConfig.type) {
        case 'mongoDB':
          var db = new MongoDatabase(databaseConfig);
          break;
      }

      // If database is set to active, connect and add to global
      if (db.active) {
        db.connect(function() {
          TA.connections.push(db);
        });
      };

    });

  },

  // --------------------------------------------------------------------------------
  // Setup kicks off the Triangular Framework
  // @param {object} The application config options
  // @return {void}
  // --------------------------------------------------------------------------------

  addApp: function (appConfig) {
    var newTriangularApp = new Triangular(appConfig);
    TA.apps.push(newTriangularApp);
  },

  // --------------------------------------------------------------------------------
  // Gets application from the TA namespace collection of created Triangular apps
  // @param {string} Name of the application to get
  // @return {boolean | object} The returned application or false
  // --------------------------------------------------------------------------------

  getApp: function (name) {

    // Find app based on matching app name
    var app = TA._.find(TA.apps, { name: name });

    // Return false if app not found, else return the app
    if(app) return app;
    else return false;

  },

  // --------------------------------------------------------------------------------
  // Listens for application to close naturally on by error and closes open DB
  // connections.
  // @return {void}
  // --------------------------------------------------------------------------------

  _listenFramworkClose: function () {

    // --------------------------------------------------------------------------------
    // Close Database Connections on exiting application
    // @return {void}
    // --------------------------------------------------------------------------------

    function closeDBConnections() {
      // Close DB connections
      TA._.each(TA.connections, function (dbConnection) {
        dbConnection.connection.Mongoose.disconnect(function() {
          TA.logger.info(dbConnection.name.bold + ' database connection closed...');
        })
      })
    }

    // --------------------------------------------------------------------------------
    // Gracefully exits application
    // @return {void}
    // --------------------------------------------------------------------------------

    function gracefulExit() {

      // Close open DB connections
      closeDBConnections();

      // Let user know it was a graceful exit
      TA.logger.info('Received Exit Signal, Closing Triangular Framework');

      // Actually exit..
      process.exit(1);

    };

    // On uncaught exception problem
    process.on('uncaughtException', function (err) {

      // Display error
      TA.logger.error('Caught exception: ' + err);

      // Close open DB connections
      closeDBConnections();

      process.exit(0);

    });

    // On called gracefully exit framework
    process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);

  }

});

// -------------------------------------------------------------------------------------------------
// NODE MODULE EXPORT
// -------------------------------------------------------------------------------------------------

module.exports = TriangularFramework;




