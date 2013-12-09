// == Public API Start ==
var ExceptionHandle = {
  // accepts: err Error
  raise: function( err ) {
    throw err;
  },
};

var Constants = {
  toBTC: function() {

  },
};

var Encryption = {
  // accepts: password string
  toPasswordDigest: function( password ) {},

};

// ExternalAPI
var BitcoinNodeAPI = {
  root: 'https://blockchain.info/',
  // accepts: addresses []string, callback function
  // returns: nil

  // callback
  // accepts: data JSON
  multiAddr: function( addresses, callback ) {
    var self = this;
    var data = {
      "active": addresses.join( '|' ),
      "cors": true
    };
    $.ajax( {
      type: "GET",
      dataType: 'json',
      url: self.root + 'multiaddr',
      data: data,
      crossDomain: true,
      success: function( ajaxResults ) {
        callback( null, ajaxResults );
      },
      error: function( err ) {
        callback( err, null );
      }
    } );
  },

  // accepts: addresses []string, callback function
  // returns: nil

  // callback
  // accepts: data JSON

  // {
  //   unspent_outputs: [
  //   {
  //     tx_hash: "810418730ef3e2b0e1d96f0a2637e0bbd70ab1ce9fe4dd07a707863cbcb68c10",
  //     tx_index: 101552953,
  //     tx_output_n: 0,
  //     script: "76a914419fb60d29b320764ed2ae6e77a16648a4e1853c88ac",
  //     value: 12430578,
  //     value_hex: "00bdacf2",
  //     confirmations: 127
  //   }
  //   ]
  // }
  getUnspent: function( addresses, callback ) {
    var self = this;
    var data = {
      "active": addresses.join( '|' ),
      "cors": true
    };
    $.ajax( {
      type: "GET",
      dataType: 'json',
      url: self.root + 'unspent',
      data: data,
      crossDomain: true,
      success: function( ajaxResults ) {
        callback( null, ajaxResults );
      },
      error: function( err ) {
        callback( err, null );
      }
    } );
  },

  // accepts: pendingTransaction obj
  // callback
  // accepts: data
  pushTx: function( tx_serialized, tx_hash, callback ) {
    var self = this;

    var post_data = {
      format: "plain",
      tx: tx_serialized,
      hash: tx_hash,
      cors: "true",
    };

    $.ajax( {
      type: "POST",
      url: self.root + 'pushtx',
      data: post_data,
      success: function( data ) {
        callback( null, data );
      },
      error: function( err ) {
        callback( err, undefined );
      }
    } );
  },
};
// == Public API End ==
