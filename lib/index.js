// ==========================================================================
// Project:   Co - Continuable Library
// Copyright: ©2010 Apple Inc. All rights reserved.
// License:   Licened under MIT license (see license.txt)
// ==========================================================================

"export YES NO CoreSupport Cs";

// Core and iterable API make up the root API
var core = require('core');
core.mixin(exports, core, require('iter'));
exports.CoreSupport = exports.Cs = exports;

// Other modules are exported as properties on the root API to namespace
exports.fs    = require('fs');
exports.path  = require('path');

// add extensions
require('ext/array');
require('ext/string');
require('ext/object');

