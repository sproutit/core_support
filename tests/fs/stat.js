// ==========================================================================
// Project:   Co - Continuable Library
// Copyright: ©2010 Apple Inc. All rights reserved.
// License:   Licened under MIT license (see license.txt)
// ==========================================================================
/*globals __filename __dirname */

var Ct = require('core_test'),
    fs = require('co:fs');
    
// ..........................................................
// ASYNC
// 

Ct.module('fs.stat - async');

Ct.test("stat non-existant file", function(t, done) {
  fs.stat('imaginary/path', function(err, stats) {
    t.ok(err, 'should have an error');
    t.ok(!stats, 'shoudl not return stats');
    done();
  });
});

Ct.test("stat regular file", function(t, done) {
  fs.stat(__filename, function(err, stats) {
    t.ok(!err, 'should not have an error');
    t.ok(stats, 'should have a stats object');
    t.equal(stats.isDirectory(), false, 'stats.isDirectory()');
    // TODO: test other attrs
    
    done();
  });
});

Ct.test("stat directory", function(t, done) {
  fs.stat(__dirname, function(err, stats) {
    t.ok(!err, 'should not have an error');
    t.ok(stats, 'should have a stats object');
    t.equal(stats.isDirectory(), true, 'stats.isDirectory()');
    // TODO: test other attrs

    done();
  });
});

// ..........................................................
// SYNC
// 

Ct.module('fs.stat - sync');

Ct.test("stat non-existant file", function(t, done) {
  t.throws(function() { fs.stat('imaginary/path'); });
  done();
});

Ct.test("stat regular file", function(t, done) {
  var stats = fs.stat(__filename);
  t.ok(stats, 'should have a stats object');
  t.equal(stats.isDirectory(), false, 'stats.isDirectory()');
  // TODO: test other attrs
    
  done();
});

Ct.test("stat directory", function(t, done) {
  var stats = fs.stat(__dirname);
  t.ok(stats, 'should have a stats object');
  t.equal(stats.isDirectory(), true, 'stats.isDirectory()');
  // TODO: test other attrs
    
  done();
});


Ct.run();