spApp.factory("TransactionPresenter", function(blockchainInfo) {

	var Transaction = function() {
		this.addresses = Wallet.addresses()
		this.rawData = []
		this.parsedData = []
	}

	Transaction.prototype = {
		getLatest: function(callback) {
			var self = this;
			blockchainInfo.multiaddr(self.addresses, function(err, res) {

				if (err) {
					throw Error(err)
				}
				self.rawData = res.data

				self.parse()

				callback(self.parsedData)
			})
		},
		parse: function() {
			var self = this;
			var txs = self.rawData.txs
			for (i in txs) {
				var inputAddresses = []
				for (x in txs[i].inputs) {
					inputAddresses.push(txs[i].inputs[x].prev_out.addr)
				}

				var time = txs[i].time
				var outgoing = Wallet.hasAnyAddress(inputAddresses)

				var parsed = {
					from: {
						truncated: outgoing ? "YOU" : txs[i].inputs[0].prev_out.addr.substring(0, 3) + "...",
						full: txs[i].inputs[0].prev_out.addr,
						css: outgoing ? "square label label-warning" : "address-link text-muted"
					},
					to: {
						truncated: outgoing ? txs[i].out[0].addr.substring(0, 3) + "..." : "YOU",
						full: txs[i].out[0].addr,
						css: outgoing ? "address-link text-muted" : "square label label-warning",
					},
					amount: Wallet.calculateAmount(txs[i]),
					time: time,
					sign: outgoing ? "-" : "+",
					color: outgoing ? "danger" : "success",
				}
				self.parsedData.push(parsed)
			}
		},
		parseHelper: function(outgoing, tx) {

		}

	}


	// Stub
	var Wallet = {
		hasAnyAddress: function(allAddresses) {
			var addr = ["168vRbBhSSQdQnyHH4ZUW8K3B65QjUQ4xJ"]

			for (i in addr) {
				for (a in allAddresses) {
					if (addr[i] === allAddresses[a]) {
						return true
					}
				}
				addr[i]
			}
			return false
		},
		// TO DO: check wallet for address
		calculateAmount: function(transaction) {
			return 0.0001
		},
		addresses: function() {
			return [
				"1FmdeybWTUsPj3QzDw3Y2X5YZNunugpcnA",
				"168vRbBhSSQdQnyHH4ZUW8K3B65QjUQ4xJ"
			]
		}
	}

	return Transaction
})
