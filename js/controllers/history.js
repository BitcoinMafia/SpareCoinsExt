'use strict';

spApp.controller('historyCtrl', function($scope, $rootScope, TransactionPresenter) {

	// TODO:
	// get allTxs from localStorage
	// show waiting bar at top
	// getBalance from localStorage
  // send request to blockchain.info/multiaddr
  // on callback, update total balance to localStorage
  // on callback, update address balances to localStorage
  // on callback, also update txs to localStorage
  // on callback, change $rootScope.balance to new balance
  // on callback, unshift new txs to top of list

	$rootScope.$watch('balance', function() {
		$scope.balance = $rootScope.balance
	})

	$scope.waiting = true

	var txs = new TransactionPresenter(function() {
		txs.getLatest(function(data) {

			$scope.waiting = false
			$scope.$apply(function() {
				$scope.transactions = data
			})
		})
	})
})
