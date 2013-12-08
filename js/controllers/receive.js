'use strict';

spApp.controller('receiveCtrl', function($scope, $rootScope) {

	// TODO: wallet should be global
	var Wallet = SpareCoins.Wallet(SpareCoins.ChromeStorage)

	$rootScope.$watch('balance', function() {
		$scope.balance = $rootScope.balance
	})

	var baseURL = "http://identicoin.herokuapp.com/address/"

	SpareCoins.ChromeStorage.get("cache", function(data) {

		$scope.$apply(function() {
			$scope.currentAddress = data.cache.currentAddress
			$scope.currentImgURL = baseURL + $scope.currentAddress
		})
	})

	$scope.generateAnotherAddress = function() {

		var addrObj = Wallet.generateAddress("password")
		var addressString = addrObj.getAddress()

		SpareCoins.ChromeStorage.set("cache", "currentAddress", addressString, function(data) {

			$scope.$apply(function() {
				$scope.currentAddress = addressString
				$scope.currentImgURL = baseURL + $scope.currentAddress
			})
		})

	}

})
