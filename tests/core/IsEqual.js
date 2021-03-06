// ==========================================================================
// Project:   SproutCore Runtime - Property Observing Library
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2009 Apple Inc. All rights reserved.
// License:   Licened under MIT license (see license.js)
// ==========================================================================

"import core_test:qunit";
var Cs = require('index'); // load sproutcore/foundation

var StringA, StringB, StringC;

module("String's - isEqual", {
	
	setup: function(){
	StringA = "Hello";
	StringB = "Hi";
	StringC = "Hello";
    }

});

test("strings should be equal ",function(){
	equals(Cs.isEqual(StringA,StringB),false);
	equals(Cs.isEqual(StringA,StringC),true);
});

var num1, num2, num3;

module("Number's - isEqual",{
 
     setup: function(){
	 num1 = 24;
	 num2 = 24;
	 num3 = 21;
     }

});
 
test("numericals should be equal ",function(){
    equals(Cs.isEqual(num1,num2),true);
	equals(Cs.isEqual(num1,num3),false);
}); 

var objectA,objectB, objectC; //global variables

module("Array's - isEqual",{
	
	setup: function(){
	objectA = [1,2];
	objectB = [1,2];
	objectC = [1];	
	}
	
});
	
test("array should be equal  ",function(){
	// NOTE: We don't test for array contents -- that would be too expensive.
	equals(Cs.isEqual(objectA,objectB),false, 'two array instances with the same values should not be equal');
	equals(Cs.isEqual(objectA,objectC),false, 'two array instances with different values should not be equal');
});	

run();
