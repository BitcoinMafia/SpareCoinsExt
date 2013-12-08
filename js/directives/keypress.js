'use strict';

spApp.directive("keypressRoutes", function($location) {
	return function($scope, element, attrs) {

		element.on("keydown", function(data) {

			var target = $(data.target)
			if (target.hasClass("keypress-fixed")) {
				if (target.val().length !== 0) {
					return;
				}
			}

			var currentPath = $location.path()
			var key = data.keyCode
			switch (currentPath) {
				case "/send":
					if (data.keyCode === 39) {
						$scope.$apply($location.path("/receive"))
					}
					break;
				case "/receive":
					if (data.keyCode === 37) {
						$scope.$apply($location.path("/send"))
					}
					if (data.keyCode === 39) {
						$scope.$apply($location.path("/history"))
					}
					break;
				case "/history":
					if (data.keyCode === 37) {
						$scope.$apply($location.path("/receive"))
					}
					break;
			}

		})
	}
})
