spApp.factory( "TransactionPresenter", function() {

	var Transaction = function( wallet ) {
		var self = this
		self.Wallet = wallet;
		self.addresses = self.Wallet.getAddressStrs();
		self.rawData = [];
		self.parsedData = [];
	}

	Transaction.prototype = {
		getLatest: function( callback ) {
			var self = this;
			BitcoinNodeAPI.multiAddr( self.addresses, function( err, res ) {

				if ( err ) {
					throw Error( err )
				}
				self.rawData = res

				self.parse()

				callback( self.parsedData )
			} )
		},
		parse: function() {
			var self = this;
			var txs = self.rawData.txs
			for ( i in txs ) {
				var inputAddresses = []
				for ( x in txs[ i ].inputs ) {
					inputAddresses.push( txs[ i ].inputs[ x ].prev_out.addr )
				}

				var time = txs[ i ].time
				var outgoing = txs[ i ].result < 0 ? true : false
				var confirmed = txs[ i ].block_height !== undefined ? true : false

				var parsed = {
					from: {
						truncated: outgoing ? "YOU" : txs[ i ].inputs[ 0 ].prev_out.addr.substring( 0, 4 ) + "..",
						full: txs[ i ].inputs[ 0 ].prev_out.addr,
						css: outgoing ? "square label label-warning" : "address-link text-muted"
					},
					to: {
						truncated: outgoing ? txs[ i ].out[ 0 ].addr.substring( 0, 4 ) + ".." : "YOU",
						full: txs[ i ].out[ 0 ].addr,
						css: outgoing ? "address-link text-muted" : "square label label-warning",
					},
					amount: Math.abs( txs[ i ].result / 100000000 ),
					time: time,
					sign: outgoing ? "-" : "+",
					color: outgoing ? "danger" : "success",
					backgroundColor: confirmed ? "confirmed" : "unconfirmed"
				}
				self.parsedData.push( parsed )
			}
		},
		parseHelper: function( outgoing, tx ) {

		}

	}

	return Transaction
} )
