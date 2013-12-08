// == Storage API Start ==

// Storage Structure

// collection         => { key  => value }
// wallet             => { addr => privKey, addr2=>privKey2 .... }
// archived           => { addr => privKey, addr2=>privKey2 .... }
// security           => { decryption_key => dk }
// txs => [ { transactions } ]

SpareCoins.ChromeStorage = {
  // accepts collection, key, value string
  // returns: nil

  // callback function()
  // accepts: object JSON
  get: function(collection, callback) {
    chrome.storage.local.get(key, function(data) {
      if (data.constructor === "string") {

      } else {
        return data;
      }
    });
  },

  set: function(collection, key, value) {

  },

  remove: function(collection, key, value) {
  },
};
// == Storage API End ==
