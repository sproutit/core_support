// ==========================================================================
// Project:   SproutCore Runtime - Property Observing Library
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2009 Apple Inc. All rights reserved.
// License:   Licened under MIT license (see license.js)
// ==========================================================================

var Ct = require('core_test:sync'),
    Cs = require('core');

require('ext/object');
    
var objectA, objectB , arrayA, stringA; // global variables

Ct.module("Object.create");

Ct.setup(function() {
    objectA = {} ;
    objectB = {} ;
	arrayA  = [1,3];
	stringA ="stringA";
});

Ct.test("should return a new object with same prototype as that of passed object", function(t) {
  t.notEqual(Object.create(objectA), objectA, "Object.create(obj)") ;
  t.throws(function() { Object.create(stringA); } , "Object.create(String)") ;
});

Ct.test("returned object should have previous object as prototype", function(t) {
  var b = Object.create(objectA);
  t.equal(b.foo, undefined, 'b should not have foo');
  
  objectA.foo = 'bar';
  t.equal(b.foo, 'bar', 'b should have foo after set');
});

Ct.run();