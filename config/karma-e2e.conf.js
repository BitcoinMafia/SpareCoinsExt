module.exports = function(config){
    config.set({
    basePath : '../',

    files : [
      'lib/angular/angular.js',
      'lib/angular-route/angular-route.js',
      'lib/angular-resource/angular-resource.js',
      'test/lib/angular/angular-mocks.js',
      'js/**/*.js',
      'test/unit/**/*.js'
    ],

    exclude : [
      'test/lib/angular/angular-loader.js',
      'test/lib/angular/*.min.js',
      'test/lib/angular/angular-scenario.js'
    ],

    autoWatch : false,

    browsers : ['Chrome'],
    frameworks: ['ng-scenario'],

    singleRun : true,

    proxies : {
      '/': 'http://localhost:8000/'
    },






    plugins : [
            'karma-junit-reporter',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-ng-scenario'
            ],

    junitReporter : {
      outputFile: 'test_out/e2e.xml',
      suite: 'e2e'
    }

})}

