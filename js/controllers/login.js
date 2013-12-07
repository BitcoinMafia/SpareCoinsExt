'use strict';

spApp.controller('loginCtrl', function($scope, $location) {

	$scope.submit = function() {
		var check = this.password === "password"

		if (check) {
			return $location.path("/send")
		}
	}

})
