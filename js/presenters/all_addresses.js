spApp.factory("AllAddressesPresenter", function() {

	var AllAddresses = function(wallet) {
		var self = this;
		self.Wallet = wallet;
		self.addresses = self.Wallet.getAddressStrs()
	}

	AllAddresses.prototype.getLatest = function(callback) {
		var self = this;

		BitcoinNodeAPI.multiAddr(self.addresses, function(err, res) {
			if (err)
				throw callback(err)

			var sortedAddresses = res.addresses.sort(function(a, b) {
				return b.final_balance - a.final_balance
			})

			callback(null, sortedAddresses)
		})
	}

	return AllAddresses

})
