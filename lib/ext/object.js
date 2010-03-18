// ==========================================================================
// Project:   CoreSupport - JavaScript Utilities
// Copyright: ©2010 Apple Inc. All rights reserved. 
//            Portions copyright Sprout Systems, Inc. 2006-2010
// License:   Licened under MIT license (see license.txt)
// ==========================================================================

// ES5 Extensions

if (!Object.create) {
  var K = function() {},
      Kproto = K.prototype;
      
  Object.create = function(base) {
    if ('object' !== typeof base) throw new TypeError('base not an object');
    K.prototype = base;
    var ret = new K();
    K.prototype = Kproto;
    return ret ;
  };
  
}

if (!Object.keys) {
  Object.keys = function(obj) {
    var ret = [];
    for(var key in obj) {
      if (!obj.hasOwnProperty(key)) continue;
      ret[ret.length]= key;
    }
    return ret;
  };
}
