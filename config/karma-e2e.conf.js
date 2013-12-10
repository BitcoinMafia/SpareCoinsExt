module.exports = function( config ) {
  config.set( {
    basePath: '../',

    files: [
      'lib/angular/angular.js',
      'lib/angular-route/angular-route.js',
      'test/e2e/**/*.js'
    ],

    autoWatch: true,
    browsers: [ 'Chrome' ],
    frameworks: [ 'ng-scenario' ],

    proxies: {
      '/': 'chrome-extension://ghjnimnfgegdkhnncbepbgdddpkbhbjh/'
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
