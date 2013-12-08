chrome.commands.onCommand.addListener(function(command) {
  console.log(command);
})

// chrome.contextMenus.create({
// 	title: "SpareCoins: Send BTC to this Address",
// 	contexts: ["all"],
// 	onclick: function(info, tab) {
// 		var possibleAdddress = info.selectionText
// 		chrome.tabs.create({
// 			url: "index.html#/send?addr=" + possibleAdddress
// 		})
// 	}
// })

// chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
// 	// TO DO: send Transaction ...
// })


var pushTransaction = function(tx_serialized, tx_hash, callback) {
	console.log("background job started ...")
	BitcoinNodeAPI.pushTx(tx_serialized, tx_hash, function(err, data) {
    if (err) {
			throw new Error("Transaction Failed")
		}

		if (data) {
			beep()
			console.log(data)
			callback()
		}
  }) ;
}


var beep = function() {
	var file = "beep.wav"
	return (new Audio(file)).play()
}
