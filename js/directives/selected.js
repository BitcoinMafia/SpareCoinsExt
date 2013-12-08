'use strict';

spApp.directive("selected", function($timeout) {
	return function($scope, element, attrs) {
		$scope.$watch('currentAddress', function() {
			$(element).focus()
			$(element).select()
		})
	}
})
