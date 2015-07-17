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

    // console.log('ngSettings', this, arguments);

    var dotFile = options.file.split('.'),
        ext = dotFile.pop(),
        defaultFile = options.defaultFile || dotFile.concat('default').concat(ext).join('.');

    if( !grunt.file.exists(options.file) ) {

      if( !grunt.file.exists(defaultFile) ) {
        throw new Error('default file: ' + defaultFile + ' is not found');
      }

      grunt.file.copy( defaultFile, options.file, { noProcess: true });

    }

    var settings = readFile[ext]( options.file ),
        _ = require('jengine-utils'),
        path = require('path'),
        dest = grunt.config.process(this.data.dest);

    if( settings[this.target] === undefined ) {
      console.warn('\'' + this.target + '\' not found in settings');
    }

    settings = _.merge({}, settings.common || {}, settings[this.target] );

    console.log('settings', '\'' + dest + '\'', JSON.stringify(settings, null, 4) );

    grunt.file.write( path.join(dest, 'ng-settings.js'), 'angular.module(\'ng.settings\',[]).constant(\'settings\',' + JSON.stringify(settings) + ');' );

    // Iterate over all specified file groups.
    // this.files.forEach(function(f) {
    //   // Concat specified files.
    //   var src = f.src.filter(function(filepath) {
    //     // Warn on and remove invalid source files (if nonull was set).
    //     if (!grunt.file.exists(filepath)) {
    //       grunt.log.warn('Source file "' + filepath + '" not found.');
    //       return false;
    //     } else {
    //       return true;
    //     }
    //   }).map(function(filepath) {
    //     // Read file source.
    //     return grunt.file.read(filepath);
    //   }).join(grunt.util.normalizelf(options.separator));
    //
    //   // Handle options.
    //   src += options.punctuation;
    //
    //   // Write the destination file.
    //   grunt.file.write(f.dest, src);
    //
    //   // Print a success message.
    //   grunt.log.writeln('File "' + f.dest + '" created.');
    // });
  });

};
