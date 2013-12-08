'use strict';

spApp.directive("spinner", function() {
	return {
		restrict: "E",
		scope: {
			waiting: "="
		},
		link: function($scope, element, attrs) {
			var opts = {}
			var defaultOpts = {
				lines: 13,
				length: 20,
				width: 10,
				radius: 30,
				corners: 1,
				rotate: 0,
				direction: 1,
				color: '#000',
				speed: 1,
				trail: 60,
				shadow: false,
				hwaccel: false,
				className: 'spinner',
				zIndex: 2e9,
				top: '50%',
				left: '100%'
			};

			if (attrs.size === "small") {
				var small = {
					length: 6,
					width: 3,
					radius: 4,
					corners: 0,
					rotate: 0,
					color: "#fff",
					top: "-25%",
					left: "30%"
				}

				opts = $.extend(defaultOpts, small)
			} else if (attrs.size === 'medium') {
				var medium = {
					length: 6,
					width: 2,
					radius: 4,
					corners: 0,
					rotate: 0,
					top: '10%',
					left: '150%'
				}

				opts = $.extend(defaultOpts, medium)
			}

			var spinner = new Spinner(opts)

			$scope.$watch('waiting', function(waiting) {
				if (waiting) {
					spinner.spin(element[0]);
				} else {
					spinner.stop()
				}
			}, true)
		}
	}
})
