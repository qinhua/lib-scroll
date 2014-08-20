'use strict';

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        name: 'scroll',
        srcPath: 'src',
        assetsPath: 'assets',
        distPath: 'build',

        clean: ['<%= distPath%>/*'],

        copy: {
            main: {
                files: [{
                    expand: true,
                    cwd: './',
                    src: ['package.json'],
                    dest: '<%= distPath %>'
                }]
            }
        },

        depconcat: {
            options: {
                separator: '\n'
            },
        
            main: {
                src: ['<%= srcPath %>/<%= name %>.js'],
                dest: '<%= distPath %>/<%= name %>.debug.js'
            },

            plugin: {
                src: ['<%= srcPath %>/plugin.js'],
                dest: '<%= distPath %>/plugin.debug.js'
            }
        },

        uglify: {
            main: {
                files: [{
                    expand: true,
                    cwd: '<%= distPath %>',
                    src: ['*.debug.js'],
                    dest: '<%= distPath %>',
                    ext: '.js'
                }]
            }
        },

        watch: {
            combo: {
                files: ['package.json'],
                tasks: ['copy', 'depcombo']
            },


            js: {
                files: ['<%= srcPath %>/*.js', '<%= srcPath %>/**/*.js'],
                tasks: ['depconcat', 'uglify', 'depcombo']
            }
        },

        depcombo: {
            debug: {
                options: {
                  useDebug: true,
                  useDaily: true,
                  output: 'url'
                },
                dest: '<%= distPath%>/combo.debug.js'
            },

            main: {
                options: {
                    output: 'file'
                },
                dest: '<%= distPath%>/combo.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-depconcat');
    grunt.loadNpmTasks('grunt-depcombo');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    
    grunt.registerTask('cmdwrap', 'wrap for CMD', function() {
        var path = require('path');
        var done = this.async();
        var type = 'lib';
        var name = 'scroll';
        var files = ['scroll', 'plugin'];
        var distPath = 'build';
        var pkgJson = grunt.file.readJSON('package.json');
        var version = pkgJson.version;

        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var jsFile = grunt.file.read(path.join(distPath, file + '.js'));
            jsFile += ('\nif (window.KISSY) {' +
                            'KISSY.add(\'mtb/{{type}}-{{name}}/{{version}}/{{file}}.cmd\', window.{{type}}.{{name}});' +
                        '} else if (\'undefined\' !== typeof define) {' +
                            'define(\'mtb/{{type}}-{{name}}/{{version}}/{{file}}.cmd\', [], window.{{type}}.{{name}});' +
                        '}').replace(/\{\{type\}\}/g, type)
                        .replace(/\{\{name\}\}/g, name)
                        .replace(/\{\{file\}\}/g, file)
                        .replace(/\{\{version\}\}/g, version);
            grunt.file.write(path.join(distPath, file + '.cmd.js'), jsFile);
        }

        done();
    });

    grunt.registerTask('dist', ['copy', 'depconcat', 'uglify', 'depcombo', 'cmdwrap']);
    grunt.registerTask('dev', ['watch']);
    
    grunt.registerTask('default', ['dist']);
}