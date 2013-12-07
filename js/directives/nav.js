'use strict';

spApp.directive("navbar", function() {
	return {
		restrict: "E",
		scope: {
			balance: "="
		},
		templateUrl: "views/_navbar.html",
	}
})
spApp.directive("menu", function() {
	return {
		restrict: "E",
		scope: {
			current: "="
		},
		templateUrl: "views/_menu.html",
	}
})
