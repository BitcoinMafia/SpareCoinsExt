spApp.factory("AllAddressesPresenter", function(blockchainInfo) {

	var AllAddresses = function() {
		this.addressInfo;
	}

	AllAddresses.prototype.getLatest = function(callback) {
		blockchainInfo.multiaddr(Wallet.allAddresses, function(err, res) {
			if (err)
				throw callback(err)
			this.addressInfo = res.data.addresses
			callback(null, this.addressInfo)
		})
	}

	// stub

	var Wallet = {
		allAddresses: [
		"1FmdeybWTUsPj3QzDw3Y2X5YZNunugpcnA",
		"168vRbBhSSQdQnyHH4ZUW8K3B65QjUQ4xJ"
		]
	}

	return AllAddresses

})
