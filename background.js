// TODO: Wallet should be global?
var Wallet = SpareCoins.Wallet( SpareCoins.ChromeStorage )

var pushTransaction = function( txSerialized, txHash, txValue, callback ) {

	BitcoinNodeAPI.pushTx( txSerialized, txHash, function( err, data ) {
		if ( err ) {
			console.log( txSerialized )
			console.log( txHash )
			console.log( err )
			throw new Error( "Transaction Failed" )
		}

		if ( data ) {
			beep()

			// Backup Wallet if high value
			var target = BigInteger.valueOf( 10000000 )
			if ( ( txValue ).compareTo( target ) > 0 ) {
				backupPrivateKeys()
			}

			callback()
		}
	} );
}

var beep = function() {
	var file = "beep.wav"
	return ( new Audio( file ) ).play()
}

var backupPrivateKeys = function() {

	Wallet.loadData( function() {
		var timestamp = ( new Date() ).getTime()

		var addresses = Wallet.getAddresses()

		var encryptedKeysURL = "data:text/csv;charset=utf-8,"

		encryptedKeysURL += escape( "Encrypted Privated Keys (AES)" + "\n" )
		encryptedKeysURL += escape( "Use a SHA256 digest of your password as the encryption key" + "\n" )

		for ( var i = 0; i < addresses.length; i++ ) {
			encryptedKeysURL += escape( addresses[ i ].getfCryptPrivateKey() + "\n" )
		}

		window.open( encryptedKeysURL )

	} )

}
