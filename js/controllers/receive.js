'use strict';

spApp.controller( 'receiveCtrl', function( $scope, $rootScope ) {

	$rootScope.$watch( 'balance', function() {
		$scope.balance = $rootScope.balance
	} )

	var Wallet = SpareCoins.Wallet( SpareCoins.ChromeStorage )
	Wallet.loadData( function() {

		var baseURL = "http://identicoin.herokuapp.com/address/"

		SpareCoins.ChromeStorage.get( "cache", function( data ) {

			if ( data === undefined ) {
				return $scope.generateAnotherAddress();
			}

			$scope.$apply( function() {
				$scope.currentAddress = data[ "currentAddress" ]
				$scope.currentImgURL = baseURL + $scope.currentAddress
			} )
		} )

		$scope.generateAnotherAddress = function() {

			SpareCoins.ChromeStorage.get( "security", function( data ) {
				var passwordDigest = data[ "passwordDigest" ]

				var addrObj = Wallet.generateAddress( passwordDigest )
				var addressString = addrObj.getAddress()

				SpareCoins.ChromeStorage.set( "cache", "currentAddress", addressString, function( data ) {

					$scope.$apply( function() {
						$scope.currentAddress = addressString
						$scope.currentImgURL = baseURL + $scope.currentAddress
					} )
				} )
			} )

		}

	} )

} )
