'use strict';

var sendFormValidator = {
	address: function($scope) {
		var inputAddress = $scope.inputAddress

		$scope.$apply(function() {
			if (inputAddress.length === 0) {
				$scope.form.address = {
					css: "warning",
					message: ""
				}
				return;
			}

			var newAddress = new SpareCoins.Address(inputAddress)
			var valid = newAddress.validate()
			if (!valid) {
				$scope.form.address = {
					css: "error",
					message: "Invalid address"
				}
				return;
			}

			$scope.form.address = {
				css: "success",
				message: "OK!",
				valid: true
			}
			return;

		})
	},
	amount: function($scope) {
		var satoshis = 100000000

		// Must use BigIntegers, floats are imprecise
		var inputAmount = BigInteger.valueOf($scope.inputAmount * satoshis)
		var balance = BigInteger.valueOf($scope.balanceInt)
		var minerFee = BigInteger.valueOf(10000)

		$scope.$apply(function() {
			if (typeof $scope.inputAmount !== "number") {
				$scope.form.amount = {
					css: "warning",
					message: ""
				}
				return;
			}

			if (inputAmount <= 0) {
				$scope.form.amount = {
					css: "error",
					message: "Must be above 0"
				}
				return;
			}

			// Compare BigIntegers
			if (inputAmount.add(minerFee).compareTo(balance) > 0) {
				$scope.form.amount = {
					css: "error",
					message: "Not enough in balance"
				}
				return;
			}

			$scope.form.amount = {
				css: "success",
				message: "OK!",
				valid: true
			}

			return;
		})

	}
}

spApp.directive('validateAddress', function() {
	return {
		restrict: 'A',
		link: function($scope, element, attrs) {
			// TODo: $scope feels too tightly coupled
			element.on("blur submit keyup", function() {
				sendFormValidator.address($scope)
			})

		}
	};
})

spApp.directive('validateAmount', function() {
	return {
		restrict: 'A',
		link: function($scope, element, attrs) {

			// TODO: $scope is too tightly coupled
			element.on("blur submit keyup", function() {
				sendFormValidator.amount($scope)
			})
		}
	};
})

spApp.directive('validateFinal', function() {
	return {
		restrict: "A",
		link: function($scope, element, attrs) {
			element.on('submit', function() {
				sendFormValidator.address($scope)
				sendFormValidator.amount($scope)
			})
		}
	}
})
