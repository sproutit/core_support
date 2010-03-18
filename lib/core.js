// ==========================================================================
// Project:   Co - Continuable Library
// Copyright: ©2010 Apple Inc. All rights reserved.
// License:   Licened under MIT license (see license.txt)
// ==========================================================================

var Cs = exports,
    SYS = require('default:sys');

Cs.YES = true;
Cs.NO  = false;

// ..........................................................
// CONSOLE LOGGING
// 

/**
  Print all arguments joined together into a single string without a trailing
  newline
  
  @returns {void}
*/
Cs.print = function(line) {
  var str = Array.prototype.join.call(arguments, '');
  SYS.print(str);
};

/**
  Print all arguments joined together into a single string with a trailing
  newline.
  
  @returns {void}
*/
Cs.println = function(line) {
  var str= Array.prototype.join.call(arguments, '');
  SYS.puts(str);
};

/**
  Immediately outputs debug arguments to the console.
*/
Cs.debug = function(line) {
  var str = Array.prototype.join.call(arguments, '');
  SYS.debug(line);
};

/**
  Returns a string representation of the object.
*/
Cs.inspect = SYS.inspect;

// ..........................................................
// OBJECT MANIPULATION
// 

// primitive mixin
function _mixin(t, items, skip, augment) {
  
  // copy reference to target object
  var len    = items.length,
      target = t || {},
      idx, options, key, src, copy;

  for (idx=skip; idx < len; idx++ ) {
    if (!(options = items[idx])) continue ;
    for(key in options) {
      if (!options.hasOwnProperty(key)) continue ;

      src  = target[key];
      copy = options[key] ;
      if (target===copy) continue ; // prevent never-ending loop

      // augment means don't copy properties unless already defined
      if (augment && (target[key] !== undefined)) copy = undefined;

      if (copy !== undefined) target[key] = copy ;
    }
  }
  
  return target;
}

/**
  Copy properties onto the first passed param, overwriting any existing 
  properties.
*/
Cs.mixin = function(t) {
  return _mixin(t, arguments, 1);
};

/**
  Copy properties onto the first passed param only if the property is not 
  already defined.
*/
Cs.augment = function(t) {
  return _mixin(t, arguments, 1, true);
};

// default __init method.  calls init() if defined.  can be overloaded.
var __init = function(args) {
  var init;
  if (init = this.init) init.apply(this, args);  
};

// generate a new constructor function
function _const() {
  return function() {
    this.__init(arguments);
    return this;
  };
}

/**
  Accepts a constructor function and returns a new constructor the extends 
  the passed value.  The new constructor will pass any constructor methods 
  along to an init() method on the prototype, if it is defined.

  Any additional passed arguments will be copied onto the object.
  
  You can also just pass hashes and we'll make up a constructor for you.
  
  @param {Function} F the constructor function to extend
  @param {Hash..} hashes optional zero or more hashes to copy props from
  @returns {Function} the new subclass
*/
Cs.extend = function(F) {
  var Ret = _const(), prot;
   
  if ('function' === typeof F) {
    prot = Ret.prototype = Object.create(F.prototype);
    if (!prot.__init) prot.__init = __init; // needed for setup
    _mixin(prot, arguments, 1);

  // build a NEW object.
  } else {
    prot = Ret.prototype = _mixin({ __init: __init }, arguments, 0);
  }
  
  prot.constructor = Ret ;
  
  return Ret;
};

// ........................................
// GLOBAL CONSTANTS
// 

Cs.mixin(Cs, {
  T_ERROR:     'error',
  T_OBJECT:    'object',
  T_NULL:      'null',
  T_CLASS:     'class',
  T_HASH:      'hash',
  T_FUNCTION:  'function',
  T_UNDEFINED: 'undefined',
  T_NUMBER:    'number',
  T_BOOL:      'boolean',
  T_ARRAY:     'array',
  T_STRING:    'string'
});

// ........................................
// TYPING & ARRAY MESSAGING
//   

/**
  Returns a consistant type for the passed item.

  Use this instead of the built-in typeOf() to get the type of an item. 
  It will return the same result across all browsers and includes a bit 
  more detail.  Here is what will be returned:

  | Return Value Constant | Meaning |
  | SC.T_STRING | String primitive |
  | SC.T_NUMBER | Number primitive |
  | SC.T_BOOLEAN | Boolean primitive |
  | SC.T_NULL | Null value |
  | SC.T_UNDEFINED | Undefined value |
  | SC.T_FUNCTION | A function |
  | SC.T_ARRAY | An instance of Array |
  | SC.T_CLASS | A SproutCore class (created using SC.Object.extend()) |
  | SC.T_OBJECT | A SproutCore object instance |
  | SC.T_HASH | A JavaScript object not inheriting from SC.Object |

  @param item {Object} the item to check
  @returns {String} the type
*/  
Cs.typeOf = function(item) {
  if (item === undefined) return SC.T_UNDEFINED ;
  if (item === null) return SC.T_NULL ; 
  var ret = typeof(item) ;
  if (ret == "object") {
    if (item instanceof Array) {
      ret = SC.T_ARRAY ;
    } else if (item instanceof Function) {
      ret = item.isClass ? SC.T_CLASS : SC.T_FUNCTION ;

    // NB: typeOf() may be called before SC.Error has had a chance to load
    // so this code checks for the presence of SC.Error first just to make
    // sure.  No error instance can exist before the class loads anyway so
    // this is safe.
    } else if (SC.Error && (item instanceof SC.Error)) {
      ret = SC.T_ERROR ;        
    } else if (item.isObject === true) {
      ret = SC.T_OBJECT ;
    } else ret = SC.T_HASH ;
  } else if (ret === SC.T_FUNCTION) ret = (item.isClass) ? SC.T_CLASS : SC.T_FUNCTION;
  return ret ;
};

/**
  Returns true if the passed value is null or undefined.  This avoids errors
  from JSLint complaining about use of ==, which can be technically 
  confusing.
  
  @param {Object} obj value to test
  @returns {Boolean}
*/
Cs.none = function none(obj) {
  return obj===null || obj===undefined;  
};

/**
  Verifies that a value is either null or an empty string.  Return false if
  the object is not a string.
  
  @param {Object} obj value to test
  @returns {Boolean}
*/
Cs.empty = function empty(obj) {
  return obj===null || obj===undefined || obj==='';
};

/**
  Converts the passed object to an Array.  If the object appears to be 
  array-like, a new array will be cloned from it.  Otherwise, a new array
  will be created with the item itself as the only item in the array.
  
  @param object {Object} any enumerable or array-like object.
  @returns {Array} Array of items
*/
Cs.A = function A(obj) {
  // null or undefined -- fast path
  if (obj===null || obj===undefined) return [] ;
  if (Array.isArray(obj)) return obj;

  if ('object' !== typeof obj) return [obj];
  if (obj.length !== undefined) return Array.prototype.slice.call(obj);
  else return [obj];
};

// ..........................................................
// GUIDS & HASHES
// 

Cs.guidKey = "_cs_guid_" + Date.now();

// Used for guid generation...
var _nextGUID = 0, _numberGuids = [], _stringGuids = {}, _keyCache = {};

/**
  Returns a unique GUID for the object.  If the object does not yet have
  a guid, one will be assigned to it.  You can call this on any object,
  SC.Object-based or not, but be aware that it will add a _guid property.

  You can also use this method on DOM Element objects.

  @param obj {Object} any object, string, number, Element, or primitive
  @returns {String} the unique guid for this instance.
*/
Cs.guidFor = function guidFor(obj) {
  
  // special cases where we don't want to add a key to object
  if (obj === undefined) return "(undefined)" ;
  if (obj === null) return '(null)' ;
  if (obj === Object) return '(Object)';
  if (obj === Array) return '(Array)';
  
  var guidKey = Cs.guidKey ;
  if (obj[guidKey]) return obj[guidKey] ;

  switch(typeof obj) {
    case Cs.T_NUMBER:
      return (_numberGuids[obj] = _numberGuids[obj] || ("nu" + obj));
    case Cs.T_STRING:
      return (_stringGuids[obj] = _stringGuids[obj] || ("st" + obj));
    case Cs.T_BOOL:
      return obj ? "(true)" : "(false)" ;
    default:
      return Cs.generateGuid(obj);
  }
};

/**
  Returns a key name that combines the named key + prefix.  This is more 
  efficient than simply combining strings because it uses a cache  
  internally for performance.
  
  @param {String} prefix the prefix to attach to the key
  @param {String} key key
  @returns {String} result 
*/
Cs.keyFor = function keyFor(prefix, key) {
  var ret, pcache = this._keyCache[prefix];
  if (!pcache) pcache = this._keyCache[prefix] = {}; // get cache for prefix
  ret = pcache[key];
  if (!ret) ret = pcache[key] = prefix + '_' + key ;
  return ret ;
};

/**
  Generates a new guid, optionally saving the guid to the object that you
  pass in.  You will rarely need to use this method.  Instead you should
  call SC.guidFor(obj), which return an existing guid if available.

  @param {Object} obj the object to assign the guid to
  @returns {String} the guid
*/
Cs.generateGuid = function(obj) { 
  var ret = ("cs" + (_nextGUID++)); 
  if (obj) obj[Cs.guidKey] = ret ;
  return ret ;
};

/**
  Returns a unique hash code for the object.  If the object implements
  a hash() method, the value of that method will be returned.  Otherwise,
  this will return the same value as guidFor().  

  Unlike guidFor(), this method allows you to implement logic in your 
  code to cause two separate instances of the same object to be treated as
  if they were equal for comparisons and other functions.

  IMPORTANT:  If you implement a hash() method, it MUST NOT return a 
  number or a string that contains only a number.  Typically hash codes 
  are strings that begin with a "%".

  @param obj {Object} the object
  @returns {String} the hash code for this instance.
*/
Cs.hashFor = function(obj) {
  return (obj && obj.hash && (typeof obj.hash === Cs.T_FUNCTION)) ? obj.hash() : Cs.guidFor(obj) ;
};
  
/**
  This will compare the two object values using their hash codes.

  @param a {Object} first value to compare
  @param b {Object} the second value to compare
  @returns {Boolean} true if the two have equal hash code values.

*/
Cs.isEqual = function(a,b) {
  // shortcut a few places.
  if (a === null) {
    return b === null ;
  } else if (a === undefined) {
    return b === undefined ;

  // finally, check their hash-codes
  } else return Cs.hashFor(a) === Cs.hashFor(b) ;
};

/** @private Used by SC.compare */
Cs.ORDER_DEFINITION = [ Cs.T_ERROR,
                        Cs.T_UNDEFINED,
                        Cs.T_NULL,
                        Cs.T_BOOL,
                        Cs.T_NUMBER,
                        Cs.T_STRING,
                        Cs.T_ARRAY,
                        Cs.T_HASH,
                        Cs.T_OBJECT,
                        Cs.T_FUNCTION,
                        Cs.T_CLASS ];
                        
/**
 This will compare two javascript values of possibly different types.
 It will tell you which one is greater than the other by returning
 -1 if the first is smaller than the second,
  0 if both are equal,
  1 if the first is greater than the second.

 The order is calculated based on SC.ORDER_DEFINITION , if types are different.
 In case they have the same type an appropriate comparison for this type is made.

 @param v {Object} first value to compare
 @param w {Object} the second value to compare
 @returns {NUMBER} -1 if v < w, 0 if v = w and 1 if v > w.

*/
Cs.compare = function (v, w) {
  // Doing a '===' check is very cheap, so in the case of equality, checking
  // this up-front is a big win.
  if (v === w) return 0;
  
  var type1 = Cs.typeOf(v);
  var type2 = Cs.typeOf(w);
  
  // If we haven't yet generated a reverse-mapping of SC.ORDER_DEFINITION,
  // do so now.
  var mapping = Cs.ORDER_DEFINITION_MAPPING;
  if (!mapping) {
    var order = Cs.ORDER_DEFINITION;
    mapping = Cs.ORDER_DEFINITION_MAPPING = {};
    var idx, len;
    for (idx = 0, len = order.length;  idx < len;  ++idx) {
      mapping[order[idx]] = idx;
    }
    
    // We no longer need SC.ORDER_DEFINITION.
    delete Cs.ORDER_DEFINITION;
  }
  
  var type1Index = mapping[type1];
  var type2Index = mapping[type2];
  
  if (type1Index < type2Index) return -1;
  if (type1Index > type2Index) return 1;
  
  // ok - types are equal - so we have to check values now
  switch (type1) {
    case Cs.T_BOOL:
    case Cs.T_NUMBER:
      if (v<w) return -1;
      if (v>w) return 1;
      return 0;

    case Cs.T_STRING:
      var comp = v.localeCompare(w);
      if (comp<0) return -1;
      if (comp>0) return 1;
      return 0;

    case Cs.T_ARRAY:
      var vLen = v.length;
      var wLen = w.length;
      var l = Math.min(vLen, wLen);
      var r = 0;
      var i = 0;
      var thisFunc = arguments.callee;
      while (r===0 && i < l) {
        r = thisFunc(v[i],w[i]);
        i++;
      }
      if (r !== 0) return r;
    
      // all elements are equal now
      // shorter array should be ordered first
      if (vLen < wLen) return -1;
      if (vLen > wLen) return 1;
      // arrays are equal now
      return 0;
      
    case Cs.T_OBJECT:
      if (v.constructor.isComparable === true) return v.constructor.compare(v, w);
      return 0;

    default:
      return 0;
  }
};

