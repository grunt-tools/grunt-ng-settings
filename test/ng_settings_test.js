'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.ngSettings = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  dev: function(test) {

    test.expect(3);

    test.equal( grunt.file.exists('settings.yml'), true );
    test.equal( grunt.file.exists('ng-settings.js'), true );
    test.equal( grunt.file.read('ng-settings.js'), 'angular.module(\'ng.settings\',[]).constant(\'settings\',{"foo":"var","text":"this is for dev"});' );

    test.done();
  },
  dist: function(test) {

    test.expect(3);

    test.equal( grunt.file.exists('settings.yml'), true );
    test.equal( grunt.file.exists('test/ng-settings.js'), true );
    test.equal( grunt.file.read('test/ng-settings.js'), 'angular.module(\'ng.settings\',[]).constant(\'settings\',{"foo":"var","text":"this is for dist"});' );

    test.done();
  },
};
