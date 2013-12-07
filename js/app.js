'use strict';
var BGPage = chrome.extension.getBackgroundPage();
var spApp = angular.module('spApp', [
  'ngRoute'
])

// Routes
spApp.config(function($routeProvider) {

  $routeProvider.when('/', {
    resolve: {
      authenticate: function($location, $rootScope, UserAuth) {

        if (UserAuth.firstTime(false)) {
          return $location.path("/password")
        }

        // TODO:
        // getBalance from localStorage
        // send request to blockchain.info/multiaddr
        // on callback, update total balance to localStorage
        // on callback, update address balances to localStorage
        // on callback, also update txs to localStorage
        // on callback, change $rootScope.balance to new balance

        $rootScope.balance = 0.123123

        if (UserAuth.loggedIn(true)) {

          return $location.path("/send")
        }

        return $location.path("/login")
      }
    }
  });

  $routeProvider.when('/login', {
    templateUrl: 'views/login.html',
    controller: 'loginCtrl'
  });

  $routeProvider.when('/send', {
    templateUrl: 'views/send.html',
    controller: 'sendCtrl'
  });

  $routeProvider.when('/receive', {
    templateUrl: 'views/receive.html',
    controller: 'receiveCtrl'
  });

  $routeProvider.when('/history', {
    templateUrl: 'views/history.html',
    controller: 'historyCtrl'
  });

  $routeProvider.when('/all-addresses', {
    templateUrl: 'views/all_addresses.html',
    controller: 'allAddressesCtrl'
  });

  $routeProvider.when('/password', {
    templateUrl: 'views/password.html',
    controller: 'passwordCtrl'
  });

  $routeProvider.otherwise({redirectTo: '/send'});
});
