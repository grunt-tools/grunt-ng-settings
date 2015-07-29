/*
 * grunt-ng-settings
 * https://github.com/jstools/grunt-ng-settings
 *
 * Copyright (c) 2015 Jesús Germade
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  var readFile = {
    yml: function (path) {
      return grunt.file.readYAML(path);
    },
    json: function (path) {
      return grunt.file.readJSON(path);
    },
    cson: function (path) {
      return require('cson').load(path);
    }
  };

  grunt.registerMultiTask('ngSettings', 'Automation of reading settings and generate angular module', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      file: 'settings.yml'
    });

    var dotFile = options.file.split('.'),
        ext = dotFile.pop(),
        defaultFile = options.defaultFile || dotFile.concat('default').concat(ext).join('.');

    if( !grunt.file.exists(options.file) ) {

      if( !options.defaultFile ) {
        grunt.fail.fatal('file: ' + options.file + ' is not found');
      } else if( !grunt.file.exists(defaultFile) ) {
        grunt.fail.fatal('default file: ' + defaultFile + ' is not found');
      } else {
        grunt.file.copy( defaultFile, options.file, { noProcess: true });
      }

    }

    var settings = readFile[ext]( options.file ),
        _ = require('jengine-utils'),
        path = require('path'),
        dest = grunt.config.process(this.data.dest);

    if( settings[this.target] === undefined ) {
      console.warn('\'' + this.target + '\' not found in settings');
    }

    settings = _.merge({}, settings.common || {}, settings[this.target] );

    grunt.file.write( path.join(dest, 'ng-settings.js'), 'angular.module(\'ng.settings\',[]).constant(\'settings\',' + JSON.stringify(settings) + ');' );
  });

};
