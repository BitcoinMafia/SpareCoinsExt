function getURLParameter( name ) {
	return decodeURI(
		( RegExp( name + '=' + '(.+?)(&|$)' ).exec( location.search ) || [ , "" ] )[ 1 ]
	);
}

var message = getURLParameter( "message" );
var url = getURLParameter( "url" );
var lineNumber = getURLParameter( "lineNumber" );

document.getElementById( "message" ).innerHTML = message;
document.getElementById( "url" ).innerHTML = "URL: " + url;
document.getElementById( "lineNumber" ).innerHTML = "Line: " + lineNumber;

var githubLink = document.getElementById( "githubLink" )

var githubBase = "https://github.com/BitcoinMafia/SpareCoinsExt/issues/new?"
var githubIssueLink = githubBase + "title=BUG&body=" + message + "%0A%0A" + url + "%0A%0A" + lineNumber

githubLink.href = githubIssueLink;
