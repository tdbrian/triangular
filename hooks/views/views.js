
/**
* @fileoverview View handler for Triangular.
*
* @original <https://github.com/queckezz/koa-views> MIT
* @modified <tdbrian@gmail.com> (Thomas Brian)
* @version 0.0.1 2014-08-15 <tdbrian@gmail.com> (Thomas Brian)

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

var resolve = require('path').resolve;
var dirname = require('path').dirname;
var fmt = require('util').format;
var merge = require('deepmerge');
var join = require('path').join;
var cons = require('co-views');
var send = require('koa-send');

// --------------------------------------------------------------------------------
// Sets up the renderer and helper functions
// @param {string} Optional path to draw view
// @param {object} Optional renderer options
// @return {function} The use middleware function
// --------------------------------------------------------------------------------

module.exports = function (path, opts) {
  var base = process.cwd();

  // set path relative to the directory the function was called + path
  if (!path || typeof path == 'object') {
    opts = path;
    path = base;
  } else {
    path = resolve(base, path);
  }

  if (!opts) opts = {};

  // default extension to `html`
  if (!opts.default) opts.default = 'html';

  for (var prop in opts) {
    var opt = opts[prop];
    if (opt == opts.map) opt = JSON.stringify(opt);
  }

  // --------------------------------------------------------------------------------
  // Middleware sets up the view to be rendered
  // --------------------------------------------------------------------------------

  return function *views (next) {
    if (this.locals && this.render) return;

    // App-specific `locals`, but honor upstream
    // middlewares that may have already set this.locals.

    this.locals = this.locals || {};

    // ---------------------------------------------------------------------------
    // Renders passed view
    // @param {string} The view to render
    // @param {object} The locals to add to and pass on
    // @return {type}
    // ---------------------------------------------------------------------------

    this.view = function *(view, locals) {

      // If no view path was passed use auto found view
      if(TA._.isObject(view)) {
        var fileBase = this.viewBase;
        // Locals must be the first param
        locals = view;

      // Specified view was passed
      } else {
        var fileBase = view;
      }

      // Add to locals
      if (!locals) locals = {};
      locals = merge(locals, this.locals);

      // Set the file extension
      var ext = opts.default;
      var file = fmt('%s.%s', fileBase, ext);

      // If html, just pass that file from public path
      if (ext == 'html' && !opts.map) {
        yield send(this, join(path, file));

      // Else render view with local data
      } else {
        var render = cons(path, opts);
        this.body = yield render(fileBase, locals);
      }

      // Set return type to html
      this.type = 'text/html';
    }

    yield next;
  }
}