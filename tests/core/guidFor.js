// ==========================================================================
// Project:   SproutCore Runtime - Property Observing Library
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2009 Apple Inc. All rights reserved.
// License:   Licened under MIT license (see license.js)
// ==========================================================================

"import core_test:qunit";
var Cs = require('index'); // load sproutcore/foundation

var objectA, objectB ; // global variables

module("Object", {
  
  setup: function() {
    objectA = {} ;
    objectB = {} ;
  }
  
});

test("should return same guid for same instance every time", function() {
  equals(Cs.guidFor(objectA), Cs.guidFor(objectA)) ;
});

test("should return different guid for different instances", function() {
  ok(Cs.guidFor(objectA) !==  Cs.guidFor(objectB), 'objectA guid='+Cs.guidFor(objectA)+' objectB guid='+Cs.guidFor(objectB)) ;
});

test("guid should not parse to a number", function() {
  equals(true, isNaN(parseInt(Cs.guidFor(objectA), 0))) ;
});

var stringA, stringACopy, stringB ; // global variables

module("String", {
  
  setup: function() {
    stringA = "string A" ;
    stringACopy = "string A" ;
    stringB = "string B" ;
  }
  
});

test("same string instance should have same guide every time", function() {
  equals(Cs.guidFor(stringA), Cs.guidFor(stringA)) ;  
});

test("two string instances with same value should have same guid", function() {
  equals(Cs.guidFor(stringA), Cs.guidFor(stringACopy)) ;  
});

test("two instances with different value should have different guid", function() {
  ok(Cs.guidFor(stringA) !==  Cs.guidFor(stringB)) ;
});

test("guid should not parse to a number", function() {
  equals(true, isNaN(parseInt(Cs.guidFor(stringA), 0))) ;
});

var numberA, numberACopy, numberB ; // global variables

module("Number", {
  
  setup: function() {
    numberA = 23 ;
    numberACopy = 23 ;
    numberB = 34 ;
  }
  
});

test("same number instance should have same guide every time", function() {
  equals(Cs.guidFor(numberA), Cs.guidFor(numberA)) ;  
});

test("two number instances with same value should have same guid", function() {
  equals(Cs.guidFor(numberA), Cs.guidFor(numberACopy)) ;  
});

test("two instances with different value should have different guid", function() {
  ok(Cs.guidFor(numberA) !==  Cs.guidFor(numberB)) ;
});

test("guid should not parse to a number", function() {
  equals(true, isNaN(parseInt(Cs.guidFor(numberA), 0))) ;
});

module("Boolean") ;

test("should always have same guid", function() {
  equals(Cs.guidFor(true), Cs.guidFor(true)) ;
  equals(Cs.guidFor(false), Cs.guidFor(false)) ;
});

test("true should have different guid than false", function() {
  ok(Cs.guidFor(true) !==  Cs.guidFor(false)) ;
});

test("guid should not parse to a number", function() {
  equals(true, isNaN(parseInt(Cs.guidFor(true), 0)), 'guid for boolean-true') ;
  equals(true, isNaN(parseInt(Cs.guidFor(false), 0)), 'guid for boolean-false') ;
});

module("Null and Undefined") ;

test("should always have same guid", function() {
  equals(Cs.guidFor(null), Cs.guidFor(null)) ;
  equals(Cs.guidFor(undefined), Cs.guidFor(undefined)) ;
});

test("null should have different guid than undefined", function() {
  ok(Cs.guidFor(null) !==  Cs.guidFor(undefined)) ;
});

test("guid should not parse to a number", function() {
  equals(true, isNaN(parseInt(Cs.guidFor(null), 0))) ;
  equals(true, isNaN(parseInt(Cs.guidFor(undefined), 0))) ;
});

var array1, array1copy, array2, array2copy;

module("Arrays", {
	
	setup: function() {
	    array1 = ['a','b','c'] ;
	    array1copy = array1 ;
		array2 = ['1','2','3'];
	    array2copy = ['1','2','3'] ;
	}
}) ;

test("same array instance should have same guide every time", function(){
	equals(Cs.guidFor(array1), Cs.guidFor(array1));
	equals(Cs.guidFor(array2), Cs.guidFor(array2));
});

test("two array instances with same value, by assigning one to the other.", function() {
	equals(Cs.guidFor(array1), Cs.guidFor(array1copy)) ;
});

test("two array instances with same value, by assigning the same value", function() {
	ok(Cs.guidFor(array2) !== Cs.guidFor(array2copy)) ;
});

test("two instances with different value should have different guid", function() {
  ok(Cs.guidFor(array1) !==  Cs.guidFor(array2)) ;
  ok(Cs.guidFor(array1copy) !==  Cs.guidFor(array2copy)) ;
});

test("guid should not parse to a number", function() {
  equals(true, isNaN(parseInt(Cs.guidFor(array1), 0))) ;
});

run();
