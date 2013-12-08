spApp.factory("AllAddressesPresenter", function() {

	var AllAddresses = function(callback) {
		var self = this
		self.Wallet = SpareCoins.Wallet(SpareCoins.ChromeStorage, function() {
			self.addresses = self.Wallet.getAddressStrs();

			callback();
		})

		self.addressInfo;
	}

	AllAddresses.prototype.getLatest = function(callback) {
		var self = this;

		// debugger
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
