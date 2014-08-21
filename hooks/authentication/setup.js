/**
* @fileoverview Handles user authentication.
*
* @author <tdbrian@gmail.com> (Thomas Brian)
* @version 0.0.1 2014-08-16 <tdbrian@gmail.com> (Thomas Brian)

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

var co = require('co');
var LocalStrategy = require('passport-local').Strategy;

// --------------------------------------------------------------------------------
// Used for passport local authentication checking
// @param {string} Passed Username
// @return {string} Passed Password
// @return {function} Completion Callback
// --------------------------------------------------------------------------------

var authLocalUser = function (username, password, done) {

  co(function *() {
    try {
      return yield TA.models.User.matchUser(username, password);
    } catch (ex) {
      return null;
    }
  })(done);

}

// -------------------------------------------------------------
// Serializes User
// -------------------------------------------------------------

var serialize = function (user, done) {
  done(null, user._id);
}

// -------------------------------------------------------------
// Deserializes User
// -------------------------------------------------------------

var deserialize = function (id, done) {
  TA.models.User.findById(id, done);
}

// -------------------------------------------------------------------------------------------------
// MODULE EXPORT
// -------------------------------------------------------------------------------------------------

// Config of passport
module.exports = function (passport) {
  passport.serializeUser(serialize);
  passport.deserializeUser(deserialize);
  passport.use(new LocalStrategy(authLocalUser));
};
