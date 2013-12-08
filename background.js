chrome.commands.onCommand.addListener(function(command) {
  console.log(command);
})

var pushTransaction = function(tx_serialized, tx_hash, callback) {

	BitcoinNodeAPI.pushTx(tx_serialized, tx_hash, function(err, data) {
    if (err) {
			throw new Error("Transaction Failed")
		}

		if (data) {
			beep()
			callback()
		}
  }) ;
}


var beep = function() {
	var file = "beep.wav"
	return (new Audio(file)).play()
}
