'use strict';

spApp.controller('receiveCtrl', function($scope, $rootScope) {


	// Wallet.getBalance()
	$rootScope.$watch('balance', function() {
		$scope.balance = $rootScope.balance
	})

	var baseURL = "http://identico.in/address/"

	var Wallet = SpareCoins.Wallet(SpareCoins.ChromeStorage, function() {

		// TO DO: Should be last generated address without money
		var addresses = Wallet.getAddressStrs()
		$scope.$apply(function() {

			var randIndex = Math.floor(Math.random() * addresses.length)
			$scope.currentAddress = addresses[randIndex]
			$scope.currentImgURL = baseURL + $scope.currentAddress

		})
	})

	$scope.generateAnotherAddress = function() {
		var addrObj = Wallet.generateAddress("password")
		$scope.currentAddress = addrObj.getAddress()
		$scope.currentImgURL = baseURL + $scope.currentAddress
	}

})
