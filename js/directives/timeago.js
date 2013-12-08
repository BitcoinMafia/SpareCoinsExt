'use strict';

spApp.directive("timeago", function() {
	return function($scope, element, attrs) {
		 var TEMPLATES = {
		    prefix: "",
		    suffix: " ago",
		    seconds: "<1 min",
		    minute: "1 min",
		    minutes: "%d mins",
		    hour: "1 hr",
		    hours: "%d hrs",
		    day: "1 day",
		    days: "%d days",
		    month: "1 mth",
		    months: "%d mths",
		    year: "a1 yr",
		    years: "%d yrs"
		};
		var buildTemplate = function(t, n) {
		    return TEMPLATES[t] && TEMPLATES[t].replace(/%d/i, Math.abs(Math.round(n)));
		};

		var getTimeAgo = function(time) {
		    if (!time)
		        return;

		    time = new Date(time * 1000);

		    var now = new Date();
		    var seconds = ((now.getTime() - time) * .001) >> 0;
		    var minutes = seconds / 60;
		    var hours = minutes / 60;
		    var days = hours / 24;
		    var years = days / 365;

		    return TEMPLATES.prefix + (
		        seconds < 45 && buildTemplate('seconds', seconds) ||
		        seconds < 90 && buildTemplate('minute', 1) ||
		        minutes < 45 && buildTemplate('minutes', minutes) ||
		        minutes < 90 && buildTemplate('hour', 1) ||
		        hours < 24 && buildTemplate('hours', hours) ||
		        hours < 42 && buildTemplate('day', 1) ||
		        days < 30 && buildTemplate('days', days) ||
		        days < 45 && buildTemplate('month', 1) ||
		        days < 365 && buildTemplate('months', days / 30) ||
		        years < 1.5 && buildTemplate('year', 1) ||
		        buildTemplate('years', years)
		        ) + TEMPLATES.suffix;
		};

		var unix = parseInt(attrs.timeago)
		var timeAgoMsg = getTimeAgo(unix)
		$(element).text(timeAgoMsg)
	}
})
