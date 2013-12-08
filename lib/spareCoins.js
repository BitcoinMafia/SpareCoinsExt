(function(){
  "use strict";

  // if ( window.SpareCoins === undefined ) {
  //   window.SpareCoins = function(){ } ;
  // }

  // SpareCoins.start = function( ) {
  //   var Wallet = new SpareCoins.Wallet( ) ;
  // } ;

  SpareCoins.Wallet = function( fStorage, callback ) {
    var self ;
    var fAddresses ;
    var fTxs ;
    var fBalance ;

    init( ) ;

    self.getAddressStrs           = getAddressStrs ;
    self.refresh                 = refresh ;
    self.generateAddress         = generateAddress;
    self.getAddresses            = getAddresses ;
    self.buildPendingTransaction = buildPendingTransaction ;

    return self ;

    function init( ) {
      self = { } ;

      fAddresses = [ ] ;
      fTxs = [ ] ;
      fBalance = 0 ;

      if (callback === undefined) {
        callback = function() {};
      }

      refresh( callback ) ;
    }

    // returns addressObj or false
    function generateAddress( passwordDigest ) {
      var newAddress = new SpareCoins.Address( ) ;
      if ( newAddress.save( passwordDigest, fStorage ) === true ) {
        fAddresses.push( newAddress ) ;
        return newAddress ;
      } else {
        SpareCoins.ExceptionHandle.raise( new Error("New Address is not able to grenerate!") ) ;
        return false ;
      }
    }

    // TODO: Custom Fee Setting
    // toAddresses: [{addr: addressObj, value: val BigInteger}]
    function buildPendingTransaction( toAddresses, passwordDigest, callback ) {
      var addressStrs = getAddressStrs() ;
      var fee = BigInteger.valueOf( 0 ) ; // TODO: Change to 10000

      // PendingTransaction
      var addressBook ;
      var selectedUnspents = [] ;
      var changeAddr = generateAddress( passwordDigest ) ;

      // TODO: Refactor this
      var txValue        = SpareCoins.Util.sumToAddresses( toAddresses )
      var txValuePlusFee = txValue.add(fee) ;

      BitcoinNodeAPI.getUnspent(addressStrs, function( err, data ) {
        if (err) { ExceptionHandle.raise(err); }
        var unspentOutputs = SpareCoins.Util.bigIntegerUnspents( data.unspent_outputs )

        // TODO: Add Test for insufficient balance: Test below conditional
        if ( !SpareCoins.Util.unspentsIsSufficient( unspentOutputs, txValuePlusFee ) ) {
          throw "Insufficient Balance"
        }

        for (var i=0; i < unspentOutputs.length; i++) {
          var unspent = unspentOutputs[i] ;

          if ( unspent.value.compareTo( txValuePlusFee ) >= 0 ) {
            // unset all previous selected unspents and use this one
            selectedUnspents = [ unspent ] ;
            break ;
          } else {
            selectedUnspents.push( unspent ) ;
            if ( SpareCoins.Util.unspentsIsSufficient( selectedUnspents, txValuePlusFee ) ) {
              break ;
            }
          }
        }

        addressBook = retrieveAddressBook( SpareCoins.Util.unspentsToAddressStrs( selectedUnspents ), passwordDigest ) ;

        // Deal with Change here: TODO: Extract this address out

        var selectedUnspentsValue = SpareCoins.Util.sumUnspents( selectedUnspents ) ;
        var changeValue = selectedUnspentsValue.subtract( txValuePlusFee ) ;
        if (changeValue.compareTo(BigInteger.ZERO) > 0) {
          toAddresses.push( {addr: changeAddr.getAddress(), value: changeValue} ) ;
        }

        var pendingTransaction = new SpareCoins.PendingTransaction( addressBook, selectedUnspents, toAddresses ) ;

        callback( pendingTransaction ) ;
      })

function retrieveAddressBook( addressStrs, passwordDigest ) {
  var addressBook = buildAddressBook( fAddresses );

  var addressBookWithPrivateKeys = {};
        // if input address not in the address book throw an error
        for (var i=0; i<addressStrs.length; i++) {
          var address = addressBook[addressStrs[i]] ;
          address.decrypt(passwordDigest) ;
          addressBookWithPrivateKeys[address.getAddress()] = address.getPrivateKey() ;
        }

        return addressBookWithPrivateKeys

        function buildAddressBook( addresses ) {
          var addressBook = {}
          for (i in addresses) {
            addressBook[addresses[i].getAddress()] = addresses[i]
          }
          return addressBook
        }
      }
    }

    function refresh( callback ) {

      getWallet( function() {
        getTransactions( callback ) ;
      } ) ;
    }

    function getLatestData( ) {
      refresh( ) ;
      var addressStrs = addressStrs( ) ;
      BitcoinNodeAPI.multiAddr(addressStrs, function(err, ajaxResults){
            // do stuff
          } ) ;
    }

    function getWallet( callback ) {
      fStorage.get( 'wallet', function( data ) {
        var walletData = data['wallet'] ;
        var addresses = Object.keys( walletData ) ;

        for ( var i = 0; i < addresses.length; i++){
          var address = addresses[i] ;
          var cryptPrivateKey = walletData[address] ;
          var newAddress = new SpareCoins.Address( address, cryptPrivateKey) ;

          fAddresses.push( newAddress ) ;
        }

        callback();
      }) ;
    }

    function getTransactions( ) {
      fStorage.get('txs', function( data ) {
        fTxs = data ;

        callback()
      }) ;
    }

    function getAddressStrs( ) {
     var addressStr = [ ];
     for ( var i = 0; i < fAddresses.length; i++) {

      if ( fAddresses[i].validate( ) ) {
        addressStr.push( fAddresses[i].getAddress()) ;
      }

    }
    return addressStr ;
  }

  function getAddresses ( ) {
    return fAddresses
  }

} ;

SpareCoins.Address = function( fAddress, fCryptPrivateKey, fPrivateKey ) {
  var self ;
  var fPrivateKey ;
  var fBalance ;

  init( ) ;

  self.save = save ;
  self.getPrivateKey       = getPrivateKey ;
  self.getfCryptPrivateKey = getfCryptPrivateKey ;
  self.getAddress          = getAddress ;
  self.validate            = validate ;
  self.encrypt             = encrypt ;
  self.decrypt             = decrypt ;
  self.toHash160           = toHash160 ;

  return self ;

  function init( ) {
    self = { } ;
    fBalance = 0 ;

    if ( fAddress === undefined && fCryptPrivateKey === undefined) {
      createNewAddress( ) ;
    }
  }

  function createPrivateKeyBytes( ) {
    var privateKeyBytes = [ ] ;
    var randArr = new Uint8Array(32) ;
    crypto.getRandomValues(randArr) ;

    for (var i = 0; i < randArr.length; i++ ) {
      privateKeyBytes[i] = randArr[i] ;
    }

    return privateKeyBytes;
  }

  function createNewAddress( ) {
    var privateKeyBytes = createPrivateKeyBytes( ) ;
    var ecKey = new Bitcoin.ECKey(privateKeyBytes) ;
    var address = ecKey.getBitcoinAddress( ).toString( ) ;

    var privateKeyWIF = new Bitcoin.Address( privateKeyBytes ) ;
    privateKeyWIF.version = 0x80;
    privateKeyWIF = privateKeyWIF.toString( ) ;

    fAddress = address ;
    fPrivateKey = privateKeyWIF ;
  }

  function validate( ) {
    var bytes = toBytes( ) ;
    var end   = bytes.length - 4 ;
    var addressChecksum = bytes.slice (end, bytes.length ) ;

    var hash = bytes.slice( 0, end ) ;
    var hashChecksum = doubleShaBytes( hash ) ;

    return assertEqual( addressChecksum, hashChecksum.slice(0, 4) ) ;

    function doubleShaBytes(hash) {
      var asBytes = { asBytes: true };
      return Crypto.SHA256( Crypto.SHA256( hash, asBytes ), asBytes );
    }

    // TODO: if (self.privateKey !== "") check private key as well
    function assertEqual(checksum1, checksum2) {
      if (checksum1.length !== checksum2.length || checksum1.length !== 4) {
        return false;
      }

      for (var i = 0; i < checksum1.length; ++i) {
        if (checksum1[i] !== checksum2[i]) return false;
      }

      return true;
    }

  }

  function toBytes( ) {
    return Bitcoin.Base58.decode(fAddress) ;
  }

  function updateBalance( balance ) {
    fBalance = balance ;
  }

    // returns: boolean
    function save( passwordDigest, storage ) {
      // what should password digest be equal to for it to be true ?
      // be specific
      if ( passwordDigest !== undefined )
        encrypt(passwordDigest);
      else
        return false;

      // TODO: Validate fCryptPrivateKey
      if ( fCryptPrivateKey !== undefined && validate( ) ) {
        storage.set("wallet", fAddress, fCryptPrivateKey);
        return true;
      } else
      return false;
    }

    function getAddress( ) {
      return fAddress
    }

    function getPrivateKey( ) {
      return fPrivateKey ;
    }

    function getfCryptPrivateKey( ) {
      return fCryptPrivateKey ;
    }

    function encrypt( passwordDigest ) {

      // TODO: check prsence of privateKey
      // TODO: make sure its UTF8 encoded
      if ( fPrivateKey !== undefined ){
        var encrypted = CryptoJS.AES.encrypt(fPrivateKey, passwordDigest);
        fCryptPrivateKey = encrypted.toString( );
        fPrivateKey = undefined;
      }
    }

    function decrypt( passwordDigest ) {
      // TODO: Check for presence
      var encryptedRoot = fCryptPrivateKey;
      var decrypted = CryptoJS.AES.decrypt(encryptedRoot, passwordDigest);
      fPrivateKey = decrypted.toString(CryptoJS.enc.Utf8);
      if (fPrivateKey === "") {
        throw new Error("Not able to Decrypt Address")
      }
      // TODO: return boolean
    }

    function toHash160( ) {
      var bytes = toBytes( ) ;
      var end = bytes.length - 4;
      var hash160 = bytes.slice( 1, end ) ;
      return Crypto.util.bytesToHex( hash160 ) ;
    }

  } ;

    // TODO: Build transcation object to deal with changeAddr and extract logic out of wallet
    // fAddressBook (addressObj decryptedKeys); fSelectedUnspents ; toAddress: [{addr: toAddress string, value: value BigInteger}]; ChangeAddr addressObj;
    SpareCoins.PendingTransaction = function( fAddressBook, fSelectedUnspents, fToAddresses ) {
      var self ;
      var fSendTx ;
      var fFee ;

      init() ;
      self.serialize = serialize ;

      return self ;

      function init() {
        self    = { } ;
        fSendTx = new Bitcoin.Transaction( ) ;
        fFee    = BigInteger.valueOf( 0 ) ; // TODO: Change to 10000

        addInput( )  ;
        addOutput( ) ;
        sign( )      ;
      }

      function addInput( ) {
        // TODO: Error handlign and check for length ;
        for (var i=0; i < fSelectedUnspents.length; i++) {
          var unspent = fSelectedUnspents[i]
          var script = new Bitcoin.Script(Crypto.util.hexToBytes(unspent.script));

          var input = {
            script:         script,
            value:          BigInteger.fromByteArrayUnsigned(Crypto.util.hexToBytes(unspent.value_hex)),
            tx_output_n:    unspent.tx_output_n,
            tx_hash:        unspent.tx_hash,
            confirmations:  unspent.confirmations
          };

          var txin = buildInput( input ) ;

          fSendTx.addInput( txin ) ;
        }

          function buildInput( input ) {
            // Start building input
            var addr = new Bitcoin.Address(input.script.simpleOutPubKeyHash()).toString();

            if (addr === null) {
              ExceptionHandle.raise('Unable to decode output address from transaction hash ' + input.tx_hash);
            }

            var b64hash = Crypto.util.bytesToBase64(Crypto.util.hexToBytes(input.tx_hash));

            var txin =  new Bitcoin.TransactionIn({outpoint: {hash: b64hash, index: input.tx_output_n, value: input.value}, script: input.script, sequence: 4294967295});
            return txin
          }
        }

        function addOutput(  ) {
          // addToAddressesOutput
          for (var i=0; i < fToAddresses.length; i++) {
            var toAddress = fToAddresses[i] ;
            fSendTx.addOutput( new Bitcoin.Address(toAddress["addr"]), toAddress["value"] ) ;
          }
        }

        function serialize() {
          return fSendTx.serialize() ;
        }

        function sign( ) {
          for (var i=0; i<fSelectedUnspents.length; i++) {
            // TODO: Refactor below as this is done in two places
            var connectedScript = new Bitcoin.Script(Crypto.util.hexToBytes(fSelectedUnspents[i].script));
            var address = new Bitcoin.Address(connectedScript.simpleOutPubKeyHash()).toString()

            var signedScript = signInput(fSendTx, i, fAddressBook[address], connectedScript, undefined)

            if (signedScript) {
              fSendTx.ins[i].script = signedScript;
            }
          }

          function signInput(tx, inputN, base58Key, connected_script, type) {
            // replaced SIGHASH_ALL
            type = type ? type : 1;

            var pubKeyHash = connected_script.simpleOutPubKeyHash();

            var inputBitcoinAddress = new Bitcoin.Address(pubKeyHash).toString();

            var secret = Bitcoin.Base58.decode(base58Key).slice(1, 33);
            var key = new Bitcoin.ECKey(secret);

            var compressed;

            // we are using bitcoin QT format on blockchain info
            if (key.getBitcoinAddress().toString() == inputBitcoinAddress.toString()) {
                compressed = false;
            } else {
                throw 'Private key does not match bitcoin address ' + inputBitcoinAddress.toString() + ' = ' + key.getBitcoinAddress().toString();
            }

            var hash = tx.hashTransactionForSignature(connected_script, inputN, type);

            var rs = key.sign(hash);
            var signature = Bitcoin.ECDSA.serializeSig(rs.r, rs.s);

            // Append hash type
            signature.push(type);

            if (!IsCanonicalSignature(signature)) {
                throw 'IsCanonicalSignature returned false';
            }

            var script;
            if (!compressed)
                script = Bitcoin.Script.createInputScript(signature, key.getPub());

            if (script == null) {
                throw 'Error creating input script';
            }

            return script;
          }
        }

      } ;

      SpareCoins.Util = (function( ) {
        var self ;

        init() ;

        self.sumUnspents          = sumUnspents ;
        self.sumToAddresses       = sumToAddresses ;
        self.bigIntegerUnspents   = bigIntegerUnspents ;
        self.unspentsIsSufficient = unspentsIsSufficient ;
        self.unspentsToAddressStrs = unspentsToAddressStrs ;
        return self ;

        function init( ) {
          self = {}
        }

      // [{addr: addressObj, value: BigInteger}]
      function sumToAddresses(toAddresses) {
        var sum = BigInteger.ZERO ;

        for (i in toAddresses) {
         sum = sum.add(toAddresses[i].value)
       }

       return sum ;
     }

     function unspentsIsSufficient(unspentOutputs, txValue) {
      return ( SpareCoins.Util.sumUnspents( unspentOutputs ).compareTo( txValue ) >= 0 )
    }

    // Must accept only big integer
    function sumUnspents(unspentOutputs) {
      var sum = BigInteger.ZERO ;

      for (var i = 0; i < unspentOutputs.length; i++) {
        if ( unspentOutputs[i].value.constructor === BigInteger ) {
          sum = sum.add( unspentOutputs[i].value )
        } else {
          throw "Unspent Value must be BigInteger" ;
        }
      }
      return sum ;
    }

    function  unspentsToAddressStrs( unspentOutputs ) {
      var addressStrs = [ ] ;

      for (var i = 0; i < unspentOutputs.length; i++) {
        var unspent = unspentOutputs[i] ;
        var script = new Bitcoin.Script(Crypto.util.hexToBytes(unspent.script));
        var pubKeyHash = script.simpleOutPubKeyHash();
        var addressStr = new Bitcoin.Address(pubKeyHash).toString();
        addressStrs.push( addressStr ) ;
      }
      return addressStrs ;
    }

    function bigIntegerUnspents(unspentOutputs) {
      var unspentOutputsBigIntegers = [];

      for (var i = 0; i < unspentOutputs.length; i++) {
        unspentOutputs[i].value = BigInteger.fromByteArrayUnsigned(Crypto.util.hexToBytes(unspentOutputs[i].value_hex)) ;
        unspentOutputsBigIntegers.push( unspentOutputs[i] ) ;
      }

      return unspentOutputsBigIntegers ;
    }
  })( ) ;

  // To do PendingTransactions PUBLIC API
  // PendingTransactions.toString
  // PendingTransactions.push
  // if (window.mocha === undefined) {
  //   SpareCoins.start( ) ;
  // }
})( ) ;



var SIGHASH_ALL = 1;
var SIGHASH_NONE = 2;
var SIGHASH_SINGLE = 3;
var SIGHASH_ANYONECANPAY = 80;

function IsCanonicalSignature(vchSig) {
    if (vchSig.length < 9)
        throw 'Non-canonical signature: too short';
    if (vchSig.length > 73)
        throw 'Non-canonical signature: too long';
    var nHashType = vchSig[vchSig.length - 1];
    if (nHashType != SIGHASH_ALL && nHashType != SIGHASH_NONE && nHashType != SIGHASH_SINGLE && nHashType != SIGHASH_ANYONECANPAY)
        throw 'Non-canonical signature: unknown hashtype byte ' + nHashType;
    if (vchSig[0] != 0x30)
        throw 'Non-canonical signature: wrong type';
    if (vchSig[1] != vchSig.length-3)
        throw 'Non-canonical signature: wrong length marker';
    var nLenR = vchSig[3];
    if (5 + nLenR >= vchSig.length)
        throw 'Non-canonical signature: S length misplaced';
    var nLenS = vchSig[5+nLenR];
    if (nLenR+nLenS+7 != vchSig.length)
        throw 'Non-canonical signature: R+S length mismatch';

    var n = 4;
    if (vchSig[n-2] != 0x02)
        throw 'Non-canonical signature: R value type mismatch';
    if (nLenR == 0)
        throw 'Non-canonical signature: R length is zero';
    if (vchSig[n+0] & 0x80)
        throw 'Non-canonical signature: R value negative';
    if (nLenR > 1 && (vchSig[n+0] == 0x00) && !(vchSig[n+1] & 0x80))
        throw 'Non-canonical signature: R value excessively padded';

    var n = 6+nLenR;
    if (vchSig[n-2] != 0x02)
        throw 'Non-canonical signature: S value type mismatch';
    if (nLenS == 0)
        throw 'Non-canonical signature: S length is zero';
    if (vchSig[n+0] & 0x80)
        throw 'Non-canonical signature: S value negative';
    if (nLenS > 1 && (vchSig[n+0] == 0x00) && !(vchSig[n+1] & 0x80))
        throw 'Non-canonical signature: S value excessively padded';

    return true;
}
