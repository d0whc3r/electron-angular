'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function(grunt) {
  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Automatically load required Grunt tasks
  require('jit-grunt')(grunt, {
    useminPrepare: 'grunt-usemin',
    ngtemplates: 'grunt-angular-templates',
    cdnify: 'grunt-google-cdn',
    cssmin: 'grunt-contrib-cssmin',
    injector: 'grunt-injector',
    jsObfuscate: 'js-obfuscator',
    'merge-json': 'grunt-merge-json-xduplicate',
    release: 'grunt-release'
  });

  // Configurable paths for the application
  var appConfig = {
    app: require('./bower.json').appPath || 'app',
    dist: 'dist',
    version: require('./package.json').version || '0.0.1',
    name: require('./package.json').name || 'electronApp'
  };

  var compilerPackage = require('google-closure-compiler');
  compilerPackage.grunt(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    yeoman: appConfig,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep', 'injector']
      },
      js: {
        files: ['<%= yeoman.app %>/scripts/**/*.js'],
        tasks: ['injector:js', 'newer:jshint:all', 'newer:jscs:all', 'release:prerelease'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      translate: {
        files: [
          '<%= yeoman.app %>/scripts/**/locale-*.json',
          '<%= yeoman.app %>/i18n/locale-*.json'
        ],
        tasks: ['merge-json', 'release:prerelease']
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'newer:jscs:test', 'karma']
      },
      compass: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}', '<%= yeoman.app %>/scripts/**/*.{scss,sass}'],
        tasks: [
          'injector:sass',
          'compass:server',
          'postcss:server',
          'release:prerelease'
        ]
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        tasks: ['release:prerelease'],
        files: [
          '<%= yeoman.app %>/{,*/}*.html',
          '<%= yeoman.app %>/scripts/**/*.html',
          '.tmp/styles/{,*/}*.css',
          '<%= yeoman.app %>/images/**/*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= yeoman.app %>/scripts/**/*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9005,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35719
      },
      livereload: {
        options: {
          open: true,
          middleware: function(connect) {
            var serveStatic = require('serve-static');
            return [
              serveStatic('.tmp'),
              connect().use(
                '/bower_components',
                serveStatic('./bower_components')
              ),
              connect().use(
                '/app/styles',
                serveStatic('./app/styles')
              ),
              serveStatic(appConfig.app)
            ];
          }
        }
      },
      test: {
        options: {
          port: 9001,
          middleware: function(connect) {
            var serveStatic = require('serve-static');
            return [
              serveStatic('.tmp'),
              serveStatic('test'),
              connect().use(
                '/bower_components',
                serveStatic('./bower_components')
              ),
              serveStatic(appConfig.app)
            ];
          }
        }
      },
      dist: {
        options: {
          open: true,
          base: '<%= yeoman.dist %>'
        }
      }
    },

    // Make sure there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= yeoman.app %>/scripts/{,*/}*.js'
        ]
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    },

    // Make sure code styles are up to par
    jscs: {
      options: {
        config: '.jscsrc',
        verbose: true
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= yeoman.app %>/scripts/{,*/}*.js'
        ]
      },
      test: {
        src: ['test/spec/{,*/}*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '.sass-cache',
            '<%= yeoman.app %>/styles/main.css*',
            '<%= yeoman.app %>/i18n/locale_parse-*.json',
            '<%= yeoman.dist %>/{,*/}*',
            '!<%= yeoman.dist %>/.git{,*/}*',
            'dist-electron'
          ]
        }]
      },
      server: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '.sass-cache',
            '<%= yeoman.app %>/styles/main.css*',
            '<%= yeoman.app %>/i18n/locale_parse-*.json'
          ]
        }]
      }
    },

    // Add vendor prefixed styles
    postcss: {
      options: {
        processors: [
          require('autoprefixer-core')({
            browsers: ['last 1 version']
          })
        ]
      },
      server: {
        options: {
          map: true
        },
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
            // dest: '<%= yeoman.dist %>/styles/'
        }]
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
            // dest: '<%= yeoman.dist %>/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the app
    wiredep: {
      app: {
        src: ['<%= yeoman.app %>/index.html'],
        ignorePath: /\.\.\//
      },
      test: {
        devDependencies: true,
        src: '<%= karma.unit.configFile %>',
        ignorePath: /\.\.\//,
        fileTypes: {
          js: {
            block: /(([\s\t]*)\/{2}\s*?bower:\s*?(\S*))(\n|\r|.)*?(\/{2}\s*endbower)/gi,
            detect: {
              js: /'(.*\.js)'/gi
            },
            replace: {
              js: '\'{{filePath}}\','
            }
          }
        }
        // },
        // sass: {
        //   src: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
        //   ignorePath: /(\.\.\/){1,2}bower_components\//
      }
    },

    // Compiles Sass to CSS and generates necessary files if requested
    compass: {
      options: {
        sassDir: '<%= yeoman.app %>/styles',
        cssDir: ['.tmp/styles', '<%= yeoman.app %>/styles'],
        // cssDir: '.tmp/styles',
        generatedImagesDir: '.tmp/images/generated',
        imagesDir: ['<%= yeoman.app %>/images', '<%= yeoman.app %>/scripts'],
        // imagesDir: '<%= yeoman.app %>/images',
        javascriptsDir: '<%= yeoman.app %>/scripts',
        fontsDir: '<%= yeoman.app %>/styles/fonts',
        importPath: './bower_components',
        httpImagesPath: '/images',
        httpGeneratedImagesPath: '/images/generated',
        httpFontsPath: '/styles/fonts',
        relativeAssets: false,
        assetCacheBuster: false,
        raw: 'Sass::Script::Number.precision = 10\n'
      },
      dist: {
        options: {
          generatedImagesDir: '<%= yeoman.dist %>/images/generated'
        }
      },
      server: {
        options: {
          sourcemap: true
        }
      }
    },

    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
          '<%= yeoman.dist %>/scripts/**/*.js',
          '<%= yeoman.dist %>/styles/{,*/}*.css',
          '<%= yeoman.dist %>/images/**/*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= yeoman.dist %>/styles/fonts/**',
          '<%= yeoman.dist %>/scripts/**/*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    // Performs rewrites based on filerev and the useminPrepare configuration
    usemin: {
      html: ['<%= yeoman.dist %>/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      js: ['<%= yeoman.dist %>/scripts/**/*.js'],
      options: {
        assetsDirs: [
          '<%= yeoman.dist %>',
          '<%= yeoman.dist %>/images',
          '<%= yeoman.dist %>/scripts/**/',
          '<%= yeoman.dist %>/styles'
        ],
        patterns: {
          js: [
            [/(images\/[^''""]*\.(png|jpg|jpeg|gif|webp|svg))/g, 'Replacing references to images'],
            [
              /["']([^:"']+\.(?:png|gif|jpe?g|css|js))["']/img,
              'Update JavaScript with assets in strings'
            ],
            [/((\/)*images\/[^''""]*\.(png|jpg|jpeg|gif|webp|svg))/g, 'Replacing references to images']
          ]
        }
      }
    },

    // The following *-min tasks will produce minified files in the dist folder
    // By default, your `index.html`'s <!-- Usemin block --> will take care of
    // minification. These next options are pre-configured if you do not wish
    // to use the Usemin blocks.
    cssmin: {
      dist: {
        files: {
          '<%= yeoman.dist %>/styles/main.css': [
            '<%= yeoman.app %>/styles/**/*.css'
          ]
        },
        options: {
          shorthandCompacting: false,
          roundingPrecision: -1
        }
        // ,
        // dest: '<%= yeoman.dist %>/styles/main.css',
        // src: '<%= yeoman.app %>/styles/{,*/}*.css'
      }
    },
    uglify: {
      options: {
        compress: true,
        mangle: true,
        sourceMap: false
      },
      dist: {
        files: {
          '<%= yeoman.dist %>/scripts/scripts.js': [
            '.tmp/**/*.js'
          ]
        }
      }
    },
    concat: {
      dist: {
        options: {
          separator: ';'
        }
      }
    },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '**/*.{png,jpg,jpeg,gif}',
          dest: '<%= yeoman.dist %>/images'
        }, {
          expand: true,
          cwd: '<%= yeoman.app %>/scripts',
          src: '**/*.{png,jpg,jpeg,gif}',
          dest: '<%= yeoman.dist %>/scripts'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '**/*.svg',
          dest: '<%= yeoman.dist %>/images'
        }, {
          expand: true,
          cwd: '<%= yeoman.app %>/scripts',
          src: '**/*.{png,jpg,jpeg,gif}',
          dest: '<%= yeoman.dist %>/scripts'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: ['*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },

    ngtemplates: {
      dist: {
        options: {
          module: 'electronApp',
          htmlmin: '<%= htmlmin.dist.options %>',
          usemin: 'scripts/scripts.js'
        },
        cwd: '<%= yeoman.app %>',
        // src: 'views/{,*/}*.html',
        src: 'scripts/**/*.html',
        dest: '.tmp/templateCache.js'
      }
    },

    // ng-annotate tries to make the code safe for minification automatically
    // by using the Angular long form for dependency injection.
    ngAnnotate: {
      options: {
        singleQuotes: true
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '.tmp/concat/scripts'
            // dest: '<%= yeoman.dist %>/scripts'
        }]
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/*.html']
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            'icons/*.{ico,png}',
            '*.{ico,png,txt}',
            '*.html',
            'images/**/*.{webp}',
            'scripts/**/*.{webp}',
            'styles/fonts/**/*.*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yeoman.dist %>/images',
          src: ['generated/*']
        }, {
          expand: true,
          cwd: '.',
          src: [
            'bower_components/angular-i18n/angular-locale_ca.js',
            'bower_components/angular-i18n/angular-locale_es.js',
            'bower_components/jquery/dist/jquery.min.js',
          ],
          dest: '<%= yeoman.dist %>'
        }, {
          expand: true,
          cwd: 'dist-node_modules',
          dest: '<%= yeoman.dist %>/node_modules',
          src: ['sqlite3/**']
        }, {
          expand: true,
          cwd: '<%= yeoman.app %>',
          src: [
            'package.json',
            'index.js',
            'i18n/locale_parse-*.json'
          ],
          dest: '<%= yeoman.dist %>'
        }, {
          expand: true,
          cwd: 'bower_components/mdi/fonts/',
          src: ['*'],
          dest: '<%= yeoman.dist %>/fonts/'
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        // 'compass:server'
        'compass'
      ],
      test: [
        'compass'
      ],
      dist: [
        // 'compass:dist',
        'compass',
        'imagemin'
        // 'svgmin'
      ],
      watch: {
        tasks: ['watch',
          'run:electron',
        ],
        options: {
          limit: 3,
          logConcurrentOutput: true
        }
      }
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'test/karma.conf.js',
        singleRun: true
      }
    },

    // Execute electron app
    run: {
      electron: {
        args: [
          'node_modules/cross-env/bin/cross-env.js',
          'NODE_ENV=development',
          './node_modules/.bin/electron',
          '<%= yeoman.app %>'
        ]
      },
      electronprod: {
        args: [
          'node_modules/cross-env/bin/cross-env.js',
          'NODE_ENV=development',
          './node_modules/.bin/electron',
          '<%= yeoman.dist %>'
        ]
      },
      installer32: {
        args: [
          'node_modules/innosetup-compiler/lib/iscc',
          '--DMyArch=ia32',
          '--DMySourcePath=dist-electron/electronApp-win32-ia32',
          '--DMyAppVersion=<%= yeoman.version %>',
          '--DMyAppName=<%= yeoman.name %>',
          'installer-win.iss',
        ]
      },
      installer64: {
        args: [
          'node_modules/cross-env/bin/cross-env.js',
          //'NODE_ENV=development',
          'innosetup-compiler',
          '--DMyArch=x64',
          '--DMySourcePath=dist-electron/electronApp-win32-x64',
          '--DMyAppVersion=<%= yeoman.version %>',
          '--DMyAppName=<%= yeoman.name %>',
          'installer-win.iss',
        ]
      }
    },

    // Inject custom js and scss files
    injector: {
      js: {
        options: {
          relative: true
        },
        files: {
          '<%= yeoman.app %>/index.html': [
            '<%= yeoman.app %>/scripts/*/**/*.js',
            '!<%= yeoman.app %>/scripts/*/**/*.exclude.js',
            '!<%= yeoman.app %>/scripts/*/**/*.exclude/**'
          ],
        }
      },
      sass: {
        options: {
          starttag: '// <!-- injector:{{ext}} -->',
          endtag: '// <!-- endinjector -->',
          relative: true,
          ignorePath: 'main.scss',
          transform: function(filepath) {
            var file = filepath.split('/').slice(-1)[0];
            // remove extension
            file = file.split('.').slice(0, -1).join('.');
            // remove "_"
            if (file.substr(0, 1) === '_') {
              file = file.substr(1);
            }
            var path = filepath.split('/').slice(0, -1).join('/') + '/';
            if (path === '/') {
              path = '';
            }
            var fpath = path + file;
            if (!fpath) {
              return;
            }
            return '@import \'' + fpath + '\';';
          }
        },
        files: {
          '<%= yeoman.app %>/styles/main.scss': [
            '<%= yeoman.app %>/styles/**/*.scss',
            '<%= yeoman.app %>/scripts/**/*.scss',
            '!<%= yeoman.app %>/scripts/**/*.exclude.scss',
            '!<%= yeoman.app %>/scripts/*/**/*.exclude/**'
          ],
        }
      }
    },

    // Obfuscator
    jsObfuscate: {
      scripts: {
        options: {
          concurrency: 2,
          keepLinefeeds: false,
          keepIndentations: false,
          encodeStrings: true,
          encodeNumbers: true,
          moveStrings: true,
          replaceNames: true,
          variableExclusions: ['^_get_', '^_set_', '^_mtd_', '^_angular_']
        },
        files: {
          '<%= yeoman.dist %>/scripts/scripts.js': [
            '<%= yeoman.dist %>/scripts/scripts.js'
          ]
        }
      },
      vendor: {
        options: {
          concurrency: 2,
          keepLinefeeds: false,
          keepIndentations: false,
          encodeStrings: true,
          encodeNumbers: true,
          moveStrings: true,
          replaceNames: true,
          variableExclusions: ['^_get_', '^_set_', '^_mtd_', '^_angular_']
        },
        files: {
          '<%= yeoman.dist %>/scripts/vendor.js': [
            '<%= yeoman.dist %>/scripts/vendor.js'
          ]
        }
      }
    },

    // Closure compiler
    'closure-compiler': {
      scripts: {
        files: {
          '<%= yeoman.dist %>/scripts/scripts.js': [
            '<%= yeoman.dist %>/scripts/scripts.js'
          ]
        },
        options: {
          // js: '/node_modules/google-closure-library/**.js',
          debug: false,
          externs: [
            compilerPackage.compiler.CONTRIB_PATH + '/externs/jquery-1.9.js',
            compilerPackage.compiler.CONTRIB_PATH + '/externs/angular-1.5.js',
            compilerPackage.compiler.CONTRIB_PATH + '/externs/angular-1.5-q_templated.js',
            compilerPackage.compiler.CONTRIB_PATH + '/externs/angular-1.5-resource.js',
            compilerPackage.compiler.CONTRIB_PATH + '/externs/angular-material.js',
            compilerPackage.compiler.CONTRIB_PATH + '/externs/ui-bootstrap.js'
          ],
          compilation_level: 'SIMPLE',
          manage_closure_dependencies: true,
          // language_in: 'ECMASCRIPT5_STRICT',
          // create_source_map: '<%= yeoman.dist %>/scripts/scripts.min.js.map',
          output_wrapper: '(function(){\n%output%\n}).call(this);'
        }
      },
      vendor: {
        files: {
          '<%= yeoman.dist %>/scripts/vendor.js': [
            '<%= yeoman.dist %>/scripts/vendor.js'
          ]
        },
        options: {
          // js: '/node_modules/google-closure-library/**.js',
          debug: false,
          externs: [
            compilerPackage.compiler.CONTRIB_PATH + '/externs/jquery-1.9.js',
            compilerPackage.compiler.CONTRIB_PATH + '/externs/angular-1.5.js',
            compilerPackage.compiler.CONTRIB_PATH + '/externs/angular-1.5-q_templated.js',
            compilerPackage.compiler.CONTRIB_PATH + '/externs/angular-1.5-resource.js',
            compilerPackage.compiler.CONTRIB_PATH + '/externs/angular-material.js',
            compilerPackage.compiler.CONTRIB_PATH + '/externs/ui-bootstrap.js'
          ],
          compilation_level: 'SIMPLE',
          manage_closure_dependencies: true,
          // language_in: 'ECMASCRIPT5_STRICT',
          // create_source_map: '<%= yeoman.dist %>/scripts/vendor.min.js.map',
          output_wrapper: '(function(){\n%output%\n}).call(this);'
        }
      }
    },

    // Merge json translate files
    'merge-json': {
      'i18n': {
        files: {
          '<%= yeoman.app %>/i18n/locale_parse-es.json': [
            '<%= yeoman.app %>/scripts/**/locale-es.json',
            '<%= yeoman.app %>/i18n/locale-es.json'
          ],
          '<%= yeoman.app %>/i18n/locale_parse-ca.json': [
            '<%= yeoman.app %>/scripts/**/locale-ca.json',
            '<%= yeoman.app %>/i18n/locale-ca.json'
          ]
        }
      }
    },

    // Release config
    release: {
      options: {
        bump: true, //default: true
        changelog: false, //default: false
        // changelogText: '<%= version %>\n', //default: '### <%= version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n'
        file: 'package.json', //default: package.json
        additionalFiles: ['bower.json'],
        add: false, //default: true
        commit: false, //default: true
        tag: false, //default: true
        push: false, //default: true
        pushTags: false, //default: true
        npm: false, //default: true
        npmtag: false, //default: no tag
        indentation: '  ', //default: '  ' (two spaces)
        // folder: 'folder/to/publish/to/npm', //default project root
        // tagName: 'some-tag-<%= version %>', //default: '<%= version %>'
        // commitMessage: 'check out my release <%= version %>', //default: 'release <%= version %>'
        // tagMessage: 'tagging version <%= version %>', //default: 'Version <%= version %>',
        beforeBump: [], // optional grunt tasks to run before file versions are bumped
        afterBump: [], // optional grunt tasks to run after file versions are bumped
        beforeRelease: [], // optional grunt tasks to run after release version is bumped up but before release is packaged
        afterRelease: [], // optional grunt tasks to run after release is packaged
        updateVars: [], // optional grunt config objects to update (this will update/set the version property on the object specified)
        // github: {
        //   apiRoot: 'https://git.example.com/v3', // Default: https://github.com
        //   repo: 'geddski/grunt-release', //put your user/repo here
        //   accessTokenVar: 'GITHUB_ACCESS_TOKE', //ENVIRONMENT VARIABLE that contains GitHub Access Token
        //
        //   // Or you can use username and password env variables, we discourage you to do so
        //   usernameVar: 'GITHUB_USERNAME', //ENVIRONMENT VARIABLE that contains GitHub username
        //   passwordVar: 'GITHUB_PASSWORD' //ENVIRONMENT VARIABLE that contains GitHub password
        // }
      }
    },

  });

  grunt.registerTask('test', [
    'clean:server',
    // 'wiredep',
    // 'injector',
    'includes',
    'concurrent:test',
    'postcss',
    'connect:test',
    'karma'
  ]);

  grunt.registerTask('serve', 'Compile then start a connect web server', function(target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      // 'wiredep',
      // 'injector',
      'release:patch',
      'includes',
      'merge-json',
      'concurrent:server',
      'postcss:server',
      // 'connect:livereload',
      'concurrent:watch',
    ]);
  });

  grunt.registerTask('server', 'DEPRECATED TASK. Use the "serve" task instead', function(target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve:' + target]);
  });

  grunt.registerTask('installer', ['installer:64']);
  grunt.registerTask('installer:64', ['run:installer64']);

  // grunt.registerTask('merge-json', ['merge-json']);
  grunt.registerTask('obfuscate', ['jsObfuscate:scripts']);
  grunt.registerTask('obfuscate:vendor', ['jsObfuscate:vendor']);
  // grunt.registerTask('closure', ['closure-compiler']);
  // grunt.registerTask('css', ['useminPrepare', 'cssmin']);
  grunt.registerTask('min', ['usemin:js']);
  grunt.registerTask('dist', ['_build', 'min']);
  grunt.registerTask('build', ['_build', 'min']);

  grunt.registerTask('_build', [
    'clean:dist',
    // 'wiredep',
    // 'injector',
    'release:minor',
    'includes',
    'merge-json',
    'useminPrepare',
    'concurrent:dist',
    'postcss',
    'ngtemplates',
    'concat',
    'ngAnnotate',
    'copy:dist',
    // 'cdnify',
    'cssmin:generated',
    'cssmin:dist',
    'uglify',
    // 'closure-compiler',
    'obfuscate',
    // 'filerev',
    'usemin',
    'htmlmin'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'newer:jscs',
    'test',
    'build'
  ]);

  grunt.registerTask('includes', [
    'wiredep',
    'injector'
  ]);
};
