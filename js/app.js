'use strict';
var BGPage = chrome.extension.getBackgroundPage();
var spApp = angular.module( 'spApp', [
  'ngRoute'
] )

// Routes
spApp.config( function( $routeProvider ) {

  $routeProvider.when( '/', {
    resolve: {
      authenticate: function( $location, $rootScope ) {
        var Wallet = SpareCoins.Wallet( SpareCoins.ChromeStorage );

        // TODO:
        // getBalance from localStorage
        // send request to blockchain.info/multiaddr
        // on callback, update total balance to localStorage
        // on callback, update address balances to localStorage
        // on callback, also update txs to localStorage
        // on callback, change $rootScope.balance to new balance

        Wallet.loadData( function() {
          var addressStrs = Wallet.getAddressStrs();

          // TODO: Extract elsewhere
          var _loadBalance = function() {
            BitcoinNodeAPI.multiAddr( addressStrs, function( err, data ) {
              if ( err ) {
                throw Error( err )
              }

              $rootScope.$apply( function() {
                $rootScope.balanceInt = BigInteger.valueOf( data[ "wallet" ][ "final_balance" ] )
                $rootScope.balance = $rootScope.balanceInt / 100000000
              } )

            } )
          }

          // First Time Users
          // TODO: set firstTime boolean key in ChromeStorage

          if ( addressStrs.length === 0 ) {
            $rootScope.$apply( function() {

              return $location.path( "/password" )
            } )
          }

          Wallet.isAuthenticated( function( authenticated ) {

            if ( authenticated === false ) {

              $rootScope.$apply( function() {
                return $location.path( "/login" )
              } )
            }

            // Entry into App
            if ( authenticated === true ) {
              _loadBalance()

              $rootScope.$apply( function() {
                return $location.path( "/send" )
              } )

            }

          } )

        } )

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

  $routeProvider.when( '/log-out', {
    resolve: {
      logOut: function( $rootScope, $location ) {
        SpareCoins.ChromeStorage.remove( "security", "passwordDigest", function() {

          $rootScope.$apply( function() {

            return $location.path( "/login" )
          } )

        } )
      }
    }
  } )

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
