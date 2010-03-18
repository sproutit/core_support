// ==========================================================================
// Project:   CoreSupport - JavaScript Utilities
// Copyright: ©2010 Apple Inc. All rights reserved. 
//            Portions copyright Sprout Systems, Inc. 2006-2010
// License:   Licened under MIT license (see license.txt)
// ==========================================================================

var core = require('core');

/**
  @file 
  
  Additional useful array operators
*/

/**
  Returns a new array with any passed parameters excluded from the list.
  
  @param {Array...} value
    One or more values to exclude from the array.
    
  @returns {Array} new array
*/
Array.prototype.without = function without(value) {
  var indexOf = this.indexOf, loc, found, lim, ret, k;
  
  // optimize case where value is not found in array
  loc = arguments.length;
  found = false;
  while(!found && (--loc>=0)) found = this.indexOf(arguments[loc])>=0;
  if (!found) return this;
  
  ret = [];
  lim = this.length;
  for(loc=0;loc<lim;loc++) {
    k = this[loc];
    if (indexOf.call(arguments, k)<0) ret[ret.length]=k;
  }
  return ret;
};

/** 
  Generates a new array with only unique items included in the list.
  
  @returns {Array}
*/
Array.prototype.uniq = function uniq() {
  var ret = [], lim = this.length, idx, k;
  for(idx=0;idx<lim;idx++) {
    k = this[idx];
    if (ret.indexOf(k)<0) ret[ret.length] = k;
  }
  return ret;
};

// ..........................................................
// ES5 EXTENSIONS
// 

if (!Array.isArray) {
  // TODO: make this more robust when called from different iframes 
  Array.isArray = function(item) {
    if ('object' !== typeof item) return false;
    if (!(item instanceof Array)) return false;
  } ;
}

// These methods will only be applied if they are not already defined b/c 
// the browser is probably getting it.
var MIXIN_IF_MISSING = {

  /**
    Invokes the passed callback on each item in the array until the method 
    returns true.  Works much like filter except that it will stop running 
    when an item is found.
  */
  find: function find(callback, context) {
    if (typeof callback !== "function") throw new TypeError() ;
    var lim = this.length, idx, k;
    for(idx=0; idx<lim; idx++) {
      k = this[idx];
      if (callback.call(context||this, k, idx)) return k;
    }
    return null;
  },

  forEach: function(callback, target) {
    if (typeof callback !== "function") throw new TypeError() ;
    var len = this.length ;
    if (target === undefined) target = null;

    for(var idx=0;idx<len;idx++) {
      var next = this[idx] ;
      callback.call(target, next, idx, this);
    }
    return this ;
  },

  map: function(callback, target) {
    if (typeof callback !== "function") throw new TypeError() ;
    var len = this.length ;
    if (target === undefined) target = null;

    var ret  = [];
    for(var idx=0;idx<len;idx++) {
      var next = this[idx] ;
      ret[idx] = callback.call(target, next, idx, this) ;
    }
    return ret ;
  },

  filter: function(callback, target) {
    if (typeof callback !== "function") throw new TypeError() ;
    var len = this.length ;
    if (target === undefined) target = null;

    var ret  = [];
    for(var idx=0;idx<len;idx++) {
      var next = this[idx] ;
      if(callback.call(target, next, idx, this)) ret.push(next) ;
    }
    return ret ;
  },

  every: function(callback, target) {
    if (typeof callback !== "function") throw new TypeError() ;
    var len = this.length ;
    if (target === undefined) target = null;

    var ret  = true;
    for(var idx=0;ret && (idx<len);idx++) {
      var next = this[idx] ;
      if(!callback.call(target, next, idx, this)) ret = false ;
    }
    return ret ;
  },

  some: function(callback, target) {
    if (typeof callback !== "function") throw new TypeError() ;
    var len = this.length ;
    if (target === undefined) target = null;

    var ret  = false;
    for(var idx=0;(!ret) && (idx<len);idx++) {
      var next = this[idx] ;
      if(callback.call(target, next, idx, this)) ret = true ;
    }
    return ret ;
  },

  reduce: function(callback, initialValue, reducerProperty) {
    if (typeof callback !== "function") throw new TypeError() ;
    var len = this.length ;

    // no value to return if no initial value & empty
    if (len===0 && initialValue === undefined) throw new TypeError();

    var ret  = initialValue;
    for(var idx=0;idx<len;idx++) {
      var next = this[idx] ;

      // while ret is still undefined, just set the first value we get as 
      // ret. this is not the ideal behavior actually but it matches the 
      // FireFox implementation... :(
      if (next !== null) {
        if (ret === undefined) {
          ret = next ;
        } else {
          ret = callback.call(null, ret, next, idx, this, reducerProperty);
        }
      }
    }

    // uh oh...we never found a value!
    if (ret === undefined) throw new TypeError() ;
    return ret ;
  },
     
  indexOf: function(object, startAt) {
    var idx, len = this.length;

    if (startAt === undefined) startAt = 0;
    else startAt = (startAt < 0) ? Math.ceil(startAt) : Math.floor(startAt);
    if (startAt < 0) startAt += len;

    for(idx=startAt;idx<len;idx++) {
      if (this[idx] === object) return idx ;
    }
    return -1;
  },

  lastIndexOf: function(object, startAt) {
    var idx, len = this.length;

    if (startAt === undefined) startAt = len-1;
    else startAt = (startAt < 0) ? Math.ceil(startAt) : Math.floor(startAt);
    if (startAt < 0) startAt += len;

    for(idx=startAt;idx>=0;idx--) {
      if (this[idx] === object) return idx ;
    }
    return -1;
  }
};

core.augment(Array.prototype, MIXIN_IF_MISSING);
