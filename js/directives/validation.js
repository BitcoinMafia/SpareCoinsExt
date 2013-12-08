'use strict';

var sendFormValidator = {
	address: function($scope) {
		var inputAddress = $scope.inputAddress

		$scope.$apply(function() {
			if (inputAddress.length === 0 ) {
				$scope.form.address = {
					css: "warning",
					message: ""
				}
				return;
			}

			// TODO: Validate checksum!!!
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
	amount: function($scope, $timeout) {
		var inputAmount = $scope.inputAmount
		var balance = $scope.balance
		var minerFee = 0.0001

		$scope.$apply(function() {
			if (typeof inputAmount !== "number") {
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

			if ((inputAmount + minerFee) >= balance) {
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

spApp.directive('validateAddress',function(){
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

spApp.directive('validateAmount',function(){
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
