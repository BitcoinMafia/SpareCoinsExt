spApp.factory("TransactionPresenter", function() {


	// Stub
	// var Wallet = {
	// 	hasAnyAddress: function(allAddresses) {
	// 		var addr = ["168vRbBhSSQdQnyHH4ZUW8K3B65QjUQ4xJ"]

	// 		for (i in addr) {
	// 			for (a in allAddresses) {
	// 				if (addr[i] === allAddresses[a]) {
	// 					return true
	// 				}
	// 			}
	// 			addr[i]
	// 		}
	// 		return false
	// 	},
	// 	// TO DO: check wallet for address
	// 	calculateAmount: function(transaction) {
	// 		return 0.0001
	// 	},
	// 	addresses: function() {
	// 		return [
	// 			"1FmdeybWTUsPj3QzDw3Y2X5YZNunugpcnA",
	// 			"168vRbBhSSQdQnyHH4ZUW8K3B65QjUQ4xJ"
	// 		]
	// 	}
	// }


	var Transaction = function(callback) {
		var self = this
		self.Wallet = SpareCoins.Wallet(SpareCoins.ChromeStorage, function() {
			self.addresses = self.Wallet.getAddressStrs();
			console.log(self.addresses)
			callback();
		})

		self.rawData = [];
		self.parsedData = [];
	}

	Transaction.prototype = {
		getLatest: function(callback) {
			var self = this;
			BitcoinNodeAPI.multiAddr(self.addresses, function(err, res) {

				if (err) {
					throw Error(err)
				}
				self.rawData = res

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
				var outgoing = txs[i].result < 0 ? true : false

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
					amount: Math.abs(txs[i].result / 100000000),
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

	return Transaction
})
