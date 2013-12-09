// == Storage API Start ==

// Storage Structure

// collection         => { key  => value }
// wallet             => { addr => privKey, addr2=>privKey2 .... }
// archived           => { addr => privKey, addr2=>privKey2 .... }
// security           => { decryption_key => dk }
// multiaddr          => { transactions: Array }
// cache              => { currentAddress: String }

if (window.SpareCoins === undefined) {
  window.SpareCoins = function() {};
}

SpareCoins.ChromeStorage = {
  // accepts collection, key, value string
  // returns: nil

  // callback function()
  // accepts: object JSON
  get: function(collection, callback) {
    chrome.storage.local.get(collection, function(data) {
      if (data === undefined) {
        callback({});
      } else {
        callback(data[collection]);
      }

    });
  },

  set: function(collection, key, value, callback) {
    this.get(collection, function(data) {
      if (data === undefined) {
        data = {}
      };

      if (data.constructor !== Object) {
        throw Error("can't set on not object")
      }

      data[key] = value;

      setObject = {};
      setObject[collection] = data;

      chrome.storage.local.set(setObject);

      if (callback === undefined) {
        callback = function() {};
      }
      callback(data);
    })
  },

  remove: function(collection, key, callback) {
    this.get(collection, function(data) {
      delete data[key];

      callback();
    })
  },
};
// == Storage API End ==
