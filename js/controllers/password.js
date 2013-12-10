'use strict';

spApp.controller( 'passwordCtrl', function( $scope, $location ) {

	$scope.submit = function() {

		if ( $scope.password !== $scope.passwordConfirm ) {
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
