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

	$scope.balance = $rootScope.balance

	var allAddresses = new AllAddressesPresenter()

	$scope.waiting = true
	allAddresses.getLatest(function(err, data) {
		if (err) {
			throw Error(err)
		}

		$scope.waiting = false
		$scope.addresses = data
	})
})
