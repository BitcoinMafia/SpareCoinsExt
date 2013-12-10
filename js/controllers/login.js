'use strict';

spApp.controller( 'loginCtrl', function( $scope, $location ) {

	var Wallet = SpareCoins.Wallet( SpareCoins.ChromeStorage );
	$scope.valid = "info"

	$scope.submit = function() {
		Wallet.loadData( function() {

			// Load Balance
			var authenticated = Wallet.authenticate( $scope.password )

			if ( authenticated === true ) {

				$scope.$apply( function() {
					return $location.path( "/" );
				} )
			}

			$scope.$apply( function() {
				$scope.errorMessage = "Incorrect Password";
				$scope.validCSS = "error";
				return;
			} )

		} );
	}

} )
