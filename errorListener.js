window.onerror = function( message, url, lineNumber ) {
	console.log( message, url, lineNumber )
	return window.location = "/error.html?" + "message=" + message + "&url=" + url + "&lineNumber=" + lineNumber
};
