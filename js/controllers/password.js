'use strict';

spApp.controller( 'passwordCtrl', function( $scope, $location ) {

	var Wallet = SpareCoins.Wallet( SpareCoins.ChromeStorage )

	Wallet.loadData( function() {

		if ( Wallet.getAddressStrs().length !== 0 ) {
			$scope.$apply( function() {
				return $location.path( "/send" )
			} )
		}

	} )

	$scope.validCSS = "info"
	$scope.submit = function() {

		if ( $scope.password.length < 8 ) {
			$scope.errorMessage = "Must be >=8 characters"
			$scope.validCSS = "error"
			return;
		}

		if ( $scope.password !== $scope.passwordConfirm ) {
			$scope.errorMessage = "Doesn't match"
			$scope.validCSS = "error"
			return;
		}

		var passwordDigest = Crypto.SHA256( $scope.password )

		SpareCoins.ChromeStorage.set( "security", "passwordDigest", passwordDigest, function() {

			$scope.$apply( function() {
				return $location.path( "/receive" )
			} )

		} )
	}

} )
