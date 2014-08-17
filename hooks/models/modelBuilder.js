
/**
* @fileoverview Triangular Framework ModelBuilder creates mongoose models
* based on both server and public model configuration files. Models are
* added to the TA.models collection for global access.
*
* @author <tdbrian@gmail.com> (Thomas Brian)
* @version 0.0.1 2014-08-10 <tdbrian@gmail.com> (Thomas Brian)

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

// @private {object} Utility for file systems calls
var FS = require("fs");

// @private {object} Utility thunking (like promises for koa)
var thunkify = require("thunkify");

// @private {object} Handles creating classes in Triangular
var klass = require('klass');

// @private {object} Used for creating models
var Mongoose = require('mongoose');

// -------------------------------------------------------------------------------------------------
// TRIANGULAR MODELBUILDER CLASS
// -------------------------------------------------------------------------------------------------

// @public {object:ModelBuilder} The Triangular Framework Model Builder Class
var ModelBuilder = klass({

  // -------------------------------------------------------------------------------------------------
  // Initializes the framework by creating the globals manager and triangular apps
  // variable to track all created apps in the TA namespace.
  // -------------------------------------------------------------------------------------------------

  initialize: function () {

    // Contains all of the framework models
    this.models = {};

  },

  // -------------------------------------------------------------------------------------------------
  // Sets up all models from the server models configuration space. These models
  // will be available client side.
  // -------------------------------------------------------------------------------------------------

  configSetup: function () {

    var self = this;

    return TA.Q.Promise(function (resolve, reject, notify) {

      // Load Public Config Files
      var serverModelsDirectory = TA.Path.join(process.cwd(), 'api', 'models');

      // Creates a model for each file in directory
      self.createModelsFromDirectory(serverModelsDirectory, function(err) {

        if(err) reject(err);
        else resolve(self.models);

      });

    });

  },

  // --------------------------------------------------------------------------------
  // Creates a mongoose model based on the name and model meta data passed
  // @param {string} File location of the models metadata
  // @param {function} Callback for when models are created
  // @return {void}
  // --------------------------------------------------------------------------------

  createModelsFromDirectory: function (modelsDirectory, modelsCreatedCallback) {

    var self = this;

    // Try to read directory file passed
    try {
      var modelFiles = FS.readdirSync(modelsDirectory);
    } catch (err) {
      modelsCreatedCallback(err);
    }

    // Async loops through each file in models directory and creates a model for each
    TA.Async.each(modelFiles, function (modelFile, modelCreatedCallback) {

      // Try to get file's model data
      try {
        var modelData = require(modelsDirectory + '/' + modelFile);
      } catch (err) {
        modelCreatedCallback(err);
      }

      // Strip model file extension
      var modelName = modelFile.substr(0, modelFile.lastIndexOf('.')) || modelFile;

      self.createModel(modelName, modelData);

      modelCreatedCallback();

    }, function (err) {

      if(err) modelsCreatedCallback(err);
      else modelsCreatedCallback();

    }); // END OF FILES ASYNC

  },

  // --------------------------------------------------------------------------------
  // Creates a model based on name and model configuration
  // @param {string} Name of the new model
  // @param {object} Model configuration data
  // @return {object:Model} The final built model
  // --------------------------------------------------------------------------------

  createModel: function (modelName, modelData) {

    var self = this;

    // Get specified model (from model meta)
    try {
      var dbConnection = TA.framework.getDBConnection(modelData._meta.db);
    } catch (err) {
      throw new Error('Cannot add model ' + modelName + ' to a non-existent database');
    }

    var modelSchemaObject = {};

    // Loop through each property and add to model
    TA._.forIn(modelData, function (attributes, property) {

      // Create the property schema object
      modelSchemaObject[property] = {};

      // Sets schema type & normalizes if necessary
      if (attributes.type && attributes.type != 'ID' && attributes.type != '_meta') {
        modelSchemaObject[property].type = self.normalizeModelTypes(attributes.type);
      } else {
        modelSchemaObject[property].type = 'String';
      }

      // If required... set
      if(attributes.required) {
        modelSchemaObject[property].required = true;
      }

    });
    // END OF DATA MODEL LOOP

    // TA.logger.info('schema...');
    // TA.logger.info(modelSchemaObject);

    // Create a schema based on configuration
    var schema = new Mongoose.Schema(modelSchemaObject);

    // ADD ADDITIONAL METHODS TO MONGOOSE SCHEMA

    // Add persist function (alias for save with promise)
    schema.method('persist', thunkify(function(){
      return this.save.apply(this, arguments);
    }));

    // Create model and add to globals
    var newModel = dbConnection.connection.db.model(modelName, schema);
    this.models[modelName] = newModel;

  },

  // --------------------------------------------------------------------------------
  // Takes a Triangular model type and converts it to a mongoose type
  // @param {string} Triangular Type
  // @return {string} Mongoose Type
  // --------------------------------------------------------------------------------

  normalizeModelTypes: function (type) {
    var originalType = type;
    type = type.toLowerCase()

    // Valid mongoose types
    var MONGOOSE_TYPES = [
      'string',
      'number',
      'date',
      'buffer',
      'boolean',
      'mixed',
      'ojectid',
      'array'
    ];

    // Valid string types
    var STRING_TYPES = [
      'string',
      'select',
      'password',
      'email',
      'ssn',
      'phone',
      'zip'
    ];

    // Check if id type
    if(type == 'id') type = 'ojectid';

    // Check if string type
    if(TA._.contains(STRING_TYPES, type)) type = 'string';

    // Switch list to array
    if(type == 'list') type = 'Array';

    if (TA._.contains(MONGOOSE_TYPES, type)) {
      return type;
    } else {
      throw new Error(originalType + " " + type + " is an invalid model type");
    };

  }

});


// -------------------------------------------------------------------------------------------------
// NODE MODULE EXPORT
// -------------------------------------------------------------------------------------------------

module.exports = ModelBuilder;




