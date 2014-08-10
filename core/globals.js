/**
* @fileoverview Manages all triangular globals.
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

var FS = require('fs');

// -------------------------------------------------------------------------------------------------
// TRIANGULAR GLOBALS
// -------------------------------------------------------------------------------------------------

module.exports = {

  triangularGlobals: [],

  // --------------------------------------------------------------------------------
  // Sets up default triangular globals
  // @return {void}
  // --------------------------------------------------------------------------------

  setupDefault: function () {

    var self = this;

    // Setup TA namespace in node globals
    GLOBAL.TA = {};

    // Setup Globals Space
    TA = {}

    // First add lodash to begin using it here (lodash is not in config)
    this.addModule('_', 'lodash');

    // Add application logger to globals
    this.addLogger();

    // Get global modules to be added
    var defaultGlobals = require('../config/defaultGlobals');
    var globalModules = defaultGlobals.modules;
    var globalProperties = defaultGlobals.properties;

    // Adds each moduel from globals config
    TA._.forOwn(globalModules, function(packageName, refName) {
      self.addModule(refName, packageName);
    });

    // Adds each property from globals config
    TA._.forOwn(globalProperties, function(packageName, refName) {
      self.add(refName, packageName);
    });

  },

  // --------------------------------------------------------------------------------
  // Adds a new global
  // @param {string} The name of the item to add
  // @param {mixed} The item to add to the globals space
  // @return {void}
  // --------------------------------------------------------------------------------

  add: function (name, item) {

    // // Tack global items
    this.triangularGlobals.push(name);

    // Add to the global stack
    GLOBAL.TA[name] = item;

  },

  // --------------------------------------------------------------------------------
  // Removes a global from the Globals stack
  // @param {string} The name of the object to remove
  // @return {void}
  // --------------------------------------------------------------------------------

  remove: function (name) {

    // Removes from tracked triangular globals
    var index = array.indexOf(name);
    if (index !== -1) {
        this.triangularGlobals.splice(index, 1);
    }

    // Removes from globals
    delete TA[name];

  },

  // --------------------------------------------------------------------------------
  // Adds a new global module
  // @param {string} The name of the item to add
  // @param {mixed} The item to add to the globals space
  // @return {void}
  // --------------------------------------------------------------------------------

  addModule: function (name, item) {

    // Tack global items
    this.triangularGlobals.push(name);

    // Add to the global stack
    TA[name] = require(item);

  },

  // --------------------------------------------------------------------------------
  // Adds application logger
  // @return {void}
  // --------------------------------------------------------------------------------

  addLogger: function () {

    // Tack global items
    this.triangularGlobals.push('logger');

    // Add to the global stack
    TA.logger = require('tracer').colorConsole({level:'debug'});

  },

  // --------------------------------------------------------------------------------
  // Lists all TA Globals
  // @return {array} Returns the array of TA Globals
  // --------------------------------------------------------------------------------

  list: function () {
    return this.triangularGlobals;
  },

  // --------------------------------------------------------------------------------
  // Prints all TA Globals
  // @return {string} Returns a comma split string of TA Globals
  // --------------------------------------------------------------------------------

  toString: function () {
    return this.triangularGlobals.toString();
  }

}
