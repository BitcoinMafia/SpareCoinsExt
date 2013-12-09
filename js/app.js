'use strict';
var BGPage = chrome.extension.getBackgroundPage();
var spApp = angular.module( 'spApp', [
  'ngRoute'
] )

// Routes
spApp.config( function( $routeProvider ) {

  $routeProvider.when( '/', {
    resolve: {
      authenticate: function( $location, $rootScope, UserAuth ) {

        if ( UserAuth.firstTime( false ) ) {
          return $location.path( "/password" )
        }

        // TODO:
        // getBalance from localStorage
        // send request to blockchain.info/multiaddr
        // on callback, update total balance to localStorage
        // on callback, update address balances to localStorage
        // on callback, also update txs to localStorage
        // on callback, change $rootScope.balance to new balance

        var Wallet = SpareCoins.Wallet( SpareCoins.ChromeStorage );

        Wallet.loadData( function( data ) {
          var addresses = Wallet.getAddressStrs()

          BitcoinNodeAPI.multiAddr( addresses, function( err, data ) {
            if ( err ) {
              throw Error( err )
            }

            $rootScope.$apply( function() {
              $rootScope.balanceInt = BigInteger.valueOf( data[ "wallet" ][ "final_balance" ] )
              $rootScope.balance = $rootScope.balanceInt / 100000000

            } )

          } )
        } )

        if ( UserAuth.loggedIn( false ) ) {
          return $location.path( "/send" )
        }

        return $location.path( "/login" )
      }
    }
  } );

  $routeProvider.when( '/login', {
    templateUrl: 'views/login.html',
    controller: 'loginCtrl'
  } );

  $routeProvider.when( '/send', {
    templateUrl: 'views/send.html',
    controller: 'sendCtrl'
  } );

  $routeProvider.when( '/receive', {
    templateUrl: 'views/receive.html',
    controller: 'receiveCtrl'
  } );

  $routeProvider.when( '/history', {
    templateUrl: 'views/history.html',
    controller: 'historyCtrl'
  } );

  $routeProvider.when( '/all-addresses', {
    templateUrl: 'views/all_addresses.html',
    controller: 'allAddressesCtrl'
  } );

  $routeProvider.when( '/password', {
    templateUrl: 'views/password.html',
    controller: 'passwordCtrl'
  } );

  $routeProvider.when( '/backup-private-keys', {
    resolve: {
      backupPrivateKeys: function( $location ) {
        BGPage.backupPrivateKeys()

        return $location.path( "/all-addresses" )
      }
    }
  } )

  // $routeProvider.otherwise({redirectTo: '/send'});
} );
