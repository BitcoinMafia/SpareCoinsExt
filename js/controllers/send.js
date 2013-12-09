'use strict';

spApp.controller( 'sendCtrl', function( $scope, $rootScope, $timeout, $routeParams ) {

	var Wallet = SpareCoins.Wallet( SpareCoins.ChromeStorage )

	$rootScope.$watch( 'balance', function() {
		$scope.balanceInt = $rootScope.balanceInt
		$scope.balance = $rootScope.balance
	} )

	$scope.setTemp = function() {
		$scope.setState( 'normal' )
		var timestamp = ( new Date() ).getTime()

		SpareCoins.ChromeStorage.set( 'cache', 'timestamp', timestamp, function() {
			SpareCoins.ChromeStorage.set( 'cache', 'inputAddress', $scope.inputAddress, function() {
				SpareCoins.ChromeStorage.set( 'cache', 'inputAmount', $scope.inputAmount, function() {} )
			} )
		} )

	}

	// States can be ["normal", "confirm", "sending", "sent"]
	$scope.setState = function( state ) {
		$scope.state = state
	}

	function _removeTemp() {
		$scope.inputAddress = ""
		$scope.inputAmount = ""

		SpareCoins.ChromeStorage.remove( 'cache', "inputAddress", function() {
			SpareCoins.ChromeStorage.remove( 'cache', "inputAmount", function() {} )
		} )
	}

	function _resetForm() {
		$scope.form = {
			address: {
				css: "info",
				example: "",
				valid: false,
			},
			amount: {
				css: "info",
				example: "(incl. 0.0001 BTC Miner Fee)",
				valid: false
			}
		}
	}

	$scope.setState( 'normal' )

	$scope.button = {
		normal: {
			message: "SEND",
			css: "success"
		},
		confirm: {
			message: "CLICK TO CONFIRM",
			css: "warning"
		},
		sending: {
			message: "SENDING...",
			css: "warning"
		},
		sent: {
			message: "SENT!",
			css: "info"
		}
	}

	$scope.form = {}
	_resetForm()

	$scope.inputAddress = ""
	$scope.inputAmount = ""

	var TTL = 60000
	SpareCoins.ChromeStorage.get( 'cache', function( data ) {
		var currentTime = ( new Date() ).getTime()
		var expiryTime = data[ 'timestamp' ] + TTL

		if ( expiryTime < currentTime ) {
			return _removeTemp();
		}

		$scope.inputAddress = data[ "inputAddress" ]
		$scope.inputAmount = data[ "inputAmount" ]

	} )

	$scope.submitForm = function() {

		if ( !$scope.form.address.valid || !$scope.form.amount.valid ) return;

		if ( $scope.state === 'sending' || $scope.state === 'sent' ) return;

		if ( $scope.state === 'normal' ) {
			$scope.setState( 'confirm' )
			return;
		}

		$scope.setState( 'sending' )

		var satoshis = 100000000
		var toAddresses = [ {
			addr: $scope.inputAddress,
			value: BigInteger.valueOf( $scope.inputAmount * satoshis )
		} ]

		Wallet.loadData( function() {
			Wallet.buildPendingTransaction( toAddresses, "password", function( pendingTransaction ) {
				var s = pendingTransaction.serialize()
				var tx_serialized = Crypto.util.bytesToHex( s );

				var tx_hash = Crypto.util.bytesToHex( Crypto.SHA256( Crypto.SHA256( s, {
					asBytes: true
				} ), {
					asBytes: true
				} ).reverse() );

				console.log( "tx_serialized", tx_serialized )

				BGPage.pushTransaction( tx_serialized, tx_hash, toAddresses[ 0 ].value, function() {
					// TODO:
					// on callback, update total balance to localStorage
					// on callback, update address balances to localStorage
					// on callback, update txs to localStorage

					// Update Balance after send
					$rootScope.$apply( function() {
						var total = ( toAddresses[ 0 ].value ).add( BigInteger.valueOf( 10000 ) )
						$rootScope.balanceInt = $rootScope.balanceInt.subtract( total )
						$rootScope.balance = $rootScope.balanceInt / 100000000
					} )

					$timeout( function() {
						$scope.setState( 'sent' )
					} )

					$timeout( function() {
						_removeTemp();
						_resetForm(); // hack
						$scope.setState( 'normal' )

					}, 2000 )

				} )

			} );
		} )
	}

	$scope.displaySendAmount = function() {
		if ( $scope.state === 'normal' && $scope.inputAmount > 0 ) {
			return true
		}
	}

} )
