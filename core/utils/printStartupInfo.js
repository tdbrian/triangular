/**
* @fileoverview Shows triangular info on startup
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

module.exports = function (name, port) {

  // Get Artwork
  var art = FS.readFileSync(process.cwd() + '/node_modules/triangular/config/triangularArt.txt',
    'utf8');

  // Get Version
  var VERSION = require('./../../package.json').version;
  var VERSION_NAME = require('./../../package.json').versionName;

  // Framework Details
  console.info(art.yellow.bold);
  console.info("Fully Operational Vertical Stack Framework Utilizing KOA, MongoDB & AngularJS"
    .yellow.bold, ' (v'.yellow.bold + VERSION.yellow.bold,
    VERSION_NAME.yellow.bold + ')'.yellow.bold);
  console.info('c2014 Authors: Thomas Brian <github.com/tdbrian> & Brenton Gillis <github.com/brentongillis>'.grey);
  console.info('REPO: https://github.com/tdbrian/triangular'.grey);
  console.info('Released Under MIT Open Source License'.grey);
  console.info('');

  console.info( name.green + ' Running ON'.green + ' http://localhost:'.yellow +
    String(port).yellow);

}