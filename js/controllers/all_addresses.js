'use strict';

spApp.controller('allAddressesCtrl', function($scope, $rootScope, AllAddressesPresenter) {

	// TODO:
	// get allAddresses from localStorage
	// show spinner instead of balance
	// getBalance from localStorage
  // send request to blockchain.info/multiaddr
  // on callback, update total balance to localStorage
  // on callback, update address balances to localStorage
  // on callback, also update txs to localStorage
  // on callback, change $rootScope.balance to new balance
  // on callback, replace spinners with balance

	$rootScope.$apply(function() {
		$scope.balance = $rootScope.balance
	})

	$scope.waiting = true

	var allAddresses = new AllAddressesPresenter(function() {

		allAddresses.getLatest(function(err, data) {
			if (err) {
				throw Error(err)
			}

			$scope.$apply(function() {
				$scope.waiting = false
				$scope.addresses = data
			})
		})
	})

})
