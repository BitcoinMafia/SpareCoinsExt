module.exports = function( config ) {
  config.set( {
    basePath: '../',

    files: [
      'lib/angular/angular.js',
      'lib/angular-route/angular-route.js',
      'lib/angular-resource/angular-resource.js',
      'test/lib/angular/angular-mocks.js',
      'js/**/*.js',
      'test/unit/**/*.js'
    ],

    exclude: [
      'test/lib/angular/angular-loader.js',
      'test/lib/angular/*.min.js',
      'test/lib/angular/angular-scenario.js'
    ],

    autoWatch: true,

    frameworks: [ 'jasmine' ],

    browsers: [ 'PhantomJS' ],

    plugins: [
      'karma-junit-reporter',
      'karma-chrome-launcher',
      'karma-phantomjs-launcher',
      'karma-firefox-launcher',
      'karma-jasmine'
    ],
    junitReporter: {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  } )
}
