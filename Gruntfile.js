'use strict';

module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/**/*.js', ],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    mocha: {
        test: {
          options: {
            mocha: {
              ignoreLeaks: false,
              grep: 'food'
            },
            reporter: 'Spec',
            run: true,
            timeout: 10000,
            dest: ['test/output/'],
            depPath: ['test/dependencies/*.js'],
            mochaPath: ['test/mocha/mocha.js'],
            assertPath: ['test/assertlib/chai.js'],
            assertInitPath: ['test/assertlib/ainit.js'],
            dataPath: ['test/data/**/*.js', '!test/data/**/test/*.js'],
            testPath: ['test/data/**/test/*.js'],
            glued: ['testdst']
        }
        }
    }
  });

  grunt.loadTasks('tasks');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.task.registerTask('default', ['jshint', 'mocha']);
};
