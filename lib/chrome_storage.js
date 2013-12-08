// == Storage API Start ==

// Storage Structure

// collection         => { key  => value }
// wallet             => { addr => privKey, addr2=>privKey2 .... }
// archived           => { addr => privKey, addr2=>privKey2 .... }
// security           => { decryption_key => dk }
// txs => [ { transactions } ]

if ( window.SpareCoins === undefined ) {
  window.SpareCoins = function(){ } ;
}

SpareCoins.ChromeStorage = {
  // accepts collection, key, value string
  // returns: nil

  // callback function()
  // accepts: object JSON
  get: function(collection, callback) {
    chrome.storage.local.get(collection, function(data) {
      callback(data);
    });
  },

  set: function(collection, key, value, callback) {
    this.get(collection, function(data) {
      if (data[collection] === undefined) {
        data             = {}
        data[collection] = {}
      };

      data[collection][key] = value ;
      chrome.storage.local.set( data ) ;

      callback() ;
    })
  },

  remove: function(collection, key, callback) {
    this.get(collection, function(data) {
      delete data[key] ;

      callback() ;
    })
  },
};
// == Storage API End ==
