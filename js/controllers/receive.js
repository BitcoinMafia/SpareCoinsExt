'use strict';

spApp.controller('receiveCtrl', function($scope, $rootScope) {


	// Wallet.getBalance()
	$scope.balance = $rootScope.balance

	var wallet = SpareCoins.Wallet( SpareCoins.ChromeStorage )

	// TO DO: Should be last generated address without money
	$scope.currentAddress = "1FYBeStNk8DNm2GcrFV5347GR8qzBNgUgi"

	$scope.generateAnotherAddress = function() {
		var addrObj = wallet.generateAddress("password")
		$scope.currentAddress = addrObj.getAddress()
	}

})
