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

var pushTransaction = function(hex, callback) {

	setTimeout(function() {
		callback('data')
		beep()
	}, 2000)

}




var beep = function() {
	var file = "beep.wav"
	return (new Audio(file)).play()
}
