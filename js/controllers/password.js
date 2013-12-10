'use strict';

spApp.controller( 'passwordCtrl', function( $scope, $location ) {

	$scope.validCSS = "info"
	$scope.submit = function() {

		if ( $scope.password !== $scope.passwordConfirm ) {
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
