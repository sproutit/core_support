// ==========================================================================
// Project:   SproutCore Runtime - Property Observing Library
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2009 Apple Inc. All rights reserved.
// License:   Licened under MIT license (see license.js)
// ==========================================================================

"import core_test:qunit";
var Cs = require('index'); // load sproutcore/foundation

var object, ClassObject;
module("item type", {
  setup: function() {
     object = {
	
	    isObject: true, 
	    
	    method:function(){
		
	    }
     };
     
     ClassObject = Cs.extend({});
	
  }   
  
});

test("should return the type for the passed item", function() {
	  var a = null;
	  var arr = [1,2,3];
	  var obj = {};
	  
      equals(Cs.T_NULL,Cs.typeOf(a),"item of type null ");
	  equals(Cs.T_ARRAY,Cs.typeOf(arr),"item of type array ");		  
	  equals(Cs.T_HASH,Cs.typeOf(obj),"item of type hash");
	  equals(Cs.T_OBJECT,Cs.typeOf(object),"item of type object");
	  equals(Cs.T_FUNCTION,Cs.typeOf(object.method),"item of type function") ;
	  equals(Cs.T_CLASS,Cs.typeOf(ClassObject),"item of type class");
});

var a,b;
module("none or undefined object type",{
	setup: function() {
		a = null;
		b = undefined; 
  }
});

test("should return true for null and undefined ",function(){
	equals(true,Cs.none(a),"for a null parameter passed  ");
	equals(true,Cs.none(b),"for a undefined parameter passed ");
});

run();
