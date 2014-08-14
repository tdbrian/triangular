
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

  },

  // -------------------------------------------------------------------------------------------------
  // Sets up all models from the public models configuration space. These models
  // will be available from both server and client side.
  // -------------------------------------------------------------------------------------------------

  setupShared: function () {

    // Load Public Config Files
    var publicModelsDirectory = TA.Path.join(process.cwd(), 'public', 'models');

    this.createModelsFromDirectory(publicModelsDirectory, function() {

    });

  },

  // -------------------------------------------------------------------------------------------------
  // Sets up all models from the server models configuration space. These models
  // will be available client side.
  // -------------------------------------------------------------------------------------------------

  setupServer: function () {

    // Load Public Config Files
    var serverModelsDirectory = TA.Path.join(process.cwd(), 'api', 'models');

    this.createModelsFromDirectory(serverModelsDirectory, function() {

    });

  },

  // --------------------------------------------------------------------------------
  // Creates a mongoose model based on the name and model meta data passed
  // @param {string} File location of the models metadata
  // @param {function} Callback for when models are created
  // @return {void}
  // --------------------------------------------------------------------------------

  createModelsFromDirectory: function (modelsDirectory, modelsCreatedCallback) {

    // Get each model data
    FS.readdirSync(modelsDirectory).forEach(function(modelFile) {

      // Get file's model data
      TA.logger.info(modelsDirectory + '/' + modelFile)
      var modelData = require(modelsDirectory + '/' + modelFile);

      // Strip model file extension
      var modelName = modelFile.substr(0, modelFile.lastIndexOf('.')) || modelFile;

      // Loop through each property and add to model
      TA._.forIn(modelData, function (attributes, property) {

        TA.logger.info(property);

      });
      // END OF DATA MODEL LOOP

    });
    // END OF FILE READ

  }

});

// -------------------------------------------------------------------------------------------------
// NODE MODULE EXPORT
// -------------------------------------------------------------------------------------------------

module.exports = ModelBuilder;

