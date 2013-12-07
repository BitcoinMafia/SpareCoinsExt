'use strict';

spApp.directive("selected", function($timeout) {
	return function($scope, element, attrs) {
		$timeout(function() {
			$(element).focus()
			$(element).select()
		})
	}
})
