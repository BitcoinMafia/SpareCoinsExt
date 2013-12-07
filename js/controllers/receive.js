'use strict';

spApp.controller('receiveCtrl', function($scope, $rootScope) {


	// Wallet.getBalance()
	$scope.balance = $rootScope.balance

	// Wallet.addresses[-1]
	$scope.currentAddress = "1FYBeStNk8DNm2GcrFV5347GR8qzBNgUgi"

	// Wallet.generateAddress()
	$scope.generateAnotherAddress = function() {
		$scope.currentAddress = "1FmdeybWTUsPj3QzDw3Y2X5YZNunugpcna"
	}

})
