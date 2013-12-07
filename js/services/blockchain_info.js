'use strict';

spApp.factory('blockchainInfo', function($http) {
	return {
		root: 'https://blockchain.info/',

	  // accepts: addresses []string, callback function
	  // returns: nil
	  // callback
	  // accepts: data JSON
	  multiaddr: function(addresses, callback) {
	  	var self = this;

	  	var url = self.root + "multiaddr"
	  	var config = {
	  		method: "GET",
	  		params: {
		  		"active": addresses.join('|'),
		  		"cors": true
		  	}
	  	}

	  	$http.get(url, config)
		  	.success(function(data, status, headers, config) {
	  			callback(null, {
	  				data: data,
	  			 	status: status
	  			})
	  		})
	  		.error(function(data, status, headers, config) {
	  			callback({
	  				data: data,
	  			 	status: status
	  			}, null)
	  		})
	  },

	  // accepts: addresses []string, callback function
	  // returns: nil

	  // callback
	  // accepts: data JSON
	  getUnspent: function(addresses, callback) {
	  	var self = this;

	  	var config = {
	  		method: "GET",
	  		params: {
		  		"active": addresses.join('|'),
		  		"cors": true
		  	}
	  	}

	  	$http.get(self.root + "unspent", config)
		  	.success(function(data, status, headers, config) {
	  			callback(null, data, status, headers, config)
	  		})
	  		.error(function(data, status, headers, config) {
	  			callback(data, null)
	  		})

	  },

	  // accepts: pendingTransaction obj
	  // callback
	  // accepts: data
	  pushTx: function(pendingTransaction) {

	  },
	}
})
