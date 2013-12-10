module.exports = function( config ) {
  config.set( {
    basePath: '../',

    files: [
      'lib/angular/angular.js',
      'lib/angular-route/angular-route.js',
      'test/e2e/**/*.js'
    ],

    autoWatch: true,
    reporters: [ 'progress', 'dots' ],
    browsers: [ 'Chrome' ],
    frameworks: [ 'ng-scenario' ],

    proxies: {
      '/': 'http://localhost:8000/'
    },
    plugins: [
      'karma-junit-reporter',
      'karma-chrome-launcher',
      'karma-jasmine',
      'karma-ng-scenario'
    ],

    junitReporter: {
      outputFile: 'test_out/e2e.xml',
      suite: 'e2e'
    }

  } )
}
