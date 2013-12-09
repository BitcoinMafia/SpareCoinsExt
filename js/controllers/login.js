'use strict';

spApp.controller( 'loginCtrl', function( $scope, $location ) {

	var Wallet = SpareCoins.Wallet( SpareCoins.ChromeStorage );
	$scope.valid = "info"

	$scope.submit = function() {
		var password = $scope.password;
		Wallet.loadData( function() {

			// Load Balance
			var authenticated = Wallet.authenticate( password )

			if ( authenticated === true ) {

				$scope.$apply( function() {
					return $location.path( "/send" );
				} )
			}

			$scope.$apply( function() {
				return $scope.validCSS = "error";
			} )

		} );
	}

} )
