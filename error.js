function getURLParameter( name ) {
	return decodeURI(
		( RegExp( name + '=' + '(.+?)(&|$)' ).exec( location.search ) || [ , "" ] )[ 1 ]
	);
}

document.getElementById( "message" ).innerHTML = getURLParameter( "message" );
document.getElementById( "url" ).innerHTML = "URL: " + getURLParameter( "url" );
document.getElementById( "lineNumber" ).innerHTML = "Line: " + getURLParameter( "lineNumber" );
