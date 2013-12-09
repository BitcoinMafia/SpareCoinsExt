// Note: This backend code base (sparecoins.js / sparecoins_lib.js / chrome_storage.js) is split into Public API and Non Public APIs. Public APIs are expected to be maintained and stayed relatively more stable. Whereas non-public APIs are considered to be private methods and may change frequently.

var expect = chai.expect;

// simulating storage so that we can run tests in the browser instead of as a chrome extension

var testStorage = {
  // accepts collection, key, value string
  // returns: nil

  // callback function()
  // accepts: object JSON
  get: function( collection, callback ) {
    var data = localStorage.getItem( collection );
    data = JSON.parse( data );

    // Getting LocalStorage and ChromeStorage API to be consistent
    // localStorage returns the value only
    // whereas ChromeStorage returns the whole object including the key
    if ( data === null ) {
      data = {};
    }

    callback( data );
    return undefined;
  },

  set: function( collection, key, value ) {
    var data = localStorage.getItem( collection );
    data = JSON.parse( data );
    if ( data === null ) {
      data = {};
      data[ key ] = value;
      localStorage.setItem( collection, JSON.stringify( data ) );
    } else {
      data[ key ] = value;
      localStorage.setItem( collection, JSON.stringify( data ) );
    }
    return undefined;
  },
  clear: function( collection ) {
    localStorage.removeItem( collection );
  },
  remove: function( collection, key, value ) {

  },
};

describe( "LocalStorage", function() {
  it( "sets an value and can retrieve it", function( done ) {
    testStorage.set( "collection", "key", "value" );
    testStorage.get( "collection", function( data ) {
      var keys = Object.keys( data );
      expect( keys.length ).to.eq( 1 );
      expect( keys[ 0 ] ).to.eq( "key" );
      expect( data[ keys[ 0 ] ] ).to.eq( "value" );
      done();
    } );
  } );

  it( "correctly gets when there is no value matching to the key", function() {

  } );
} );

describe( "Wallet", function() {
  beforeEach( function( done ) {
    testStorage.clear( "wallet" );

    var Wallet = new SpareCoins.Wallet( testStorage )
    Wallet.loadData( function() {
      for ( var i = 0; i < 10; ++i ) {
        Wallet.generateAddress( "passwordDigest" );
      }
      expect( Wallet.getAddresses().length ).to.eq( 10 );
      done();
    } );
  } );

  // it("init loads up recent tx and addresses", function(done){
  //   var spy = sinon.spy(wallet.storage, "get");
  //   wallet.init(function() {
  //     expect(wallet.addresses.length).to.eq(10);
  //   });

  //   // storage should receive get twice: 1, recent txs 2, wallet
  //   expect(wallet.storage.get.calledTwice).to.eq(true);
  //   expect(wallet.storage.get.calledWith("txs")).to.eq(true);
  //   expect(wallet.storage.get.calledWith("wallet")).to.eq(true);

  //   // test finished; restore
  //   wallet.storage.get.restore();
  //   done();
  // });

  it( "is able to generate and save new addresses", function( done ) {
    var Wallet = new SpareCoins.Wallet( testStorage )
    Wallet.loadData( function() {
      var address = Wallet.generateAddress( "passwordDigest" );
      expect( address.getPrivateKey() ).to.eq( undefined );
      expect( address.getfCryptPrivateKey().constructor ).to.eq( String );
      done();
    } );
  } );

  it( "able to generate the addressStrs as an array", function( done ) {
    this.timeout( 5000 )
    var Wallet = new SpareCoins.Wallet( testStorage )
    Wallet.loadData( function() {
      expect( Wallet.getAddresses().length ).to.eq( 10 );

      var addressStrs = Wallet.getAddressStrs();
      expect( addressStrs[ 0 ].constructor ).to.eq( String )
      expect( addressStrs.length ).to.eq( 10 );
      done();

    } );
  } );

  it( "is able to update with latest data from blockchain.info", function( done ) {
    // var wallet = new Wallet(testStorage);
    // wallet.getLatestData(function() {
    //   done();
    // });
    done();
  } );

  it( "is able to save newAddress and update its own array of addresses", function( done ) {
    // wallet._saveNewAddress()
    done();
  } );

  it( "build a pushable transaction", function( done ) {
    this.timeout( 10000 );
    new SpareCoins.Address( "1NJ3dRBeVnQW7Ar2J5q8SBZ3rYpLzYL6eP", "", "5Ka9r9XJvvBg8EERQ95vGsaPzAYYA4SHspxHs4KkHnxChJrmZf3" ).save( "passwordDigest", testStorage );

    var Wallet = new SpareCoins.Wallet( testStorage );
    Wallet.loadData( function() {
      // TODO: write a wrapper to create toAddresses
      var toAddresses = [ {
        addr: "1DaVAK9bbTYUb2xMALmkcFHBokDmqoihVe",
        value: BigInteger.valueOf( 1000 )
      } ];

      Wallet.buildPendingTransaction( toAddresses, "passwordDigest", function( pendingTransaction ) {

        alert( pendingTransaction.serialize(), pendingTransaction.txHash() );

        done();
      } );
    } );
  } );
} );

describe( "Address", function() {
  // === Public API Start ===
  // address.validate()
  it( "correctly checks the validity of the address", function( done ) {
    var validAddress = new SpareCoins.Address( "1JwSSubhmg6iPtRjtyqhUYYH7bZg3Lfy1T" );
    expect( validAddress.validate() ).to.eq( true );

    // changed last character T to a
    var invalidAddress = new SpareCoins.Address( "1JwSSubhmg6iPtRjtyqhUYYH7bZg3Lfy1a" );
    expect( invalidAddress.validate() ).to.eq( false );

    done();
  } );

  it( "able to encrypt and decrypt privateKey using password digest", function( done ) {
    var newAddress = new SpareCoins.Address();
    var originalPrivateKey = newAddress.getPrivateKey();

    newAddress.encrypt( "passwordDigest" );
    expect( newAddress.getPrivateKey() ).to.eq( undefined );
    newAddress.decrypt( "passwordDigest" );
    expect( newAddress.getPrivateKey() ).to.eq( originalPrivateKey );
    done();
  } );

  // === Public API End ===

  // address.save()
  it( "ablt to encrypt and save itself into localStorage", function( done ) {
    // address.save(passwordDigest, storage)
    done();
  } );

  it( "initializes with new address if no arguments given", function( done ) {
    var address = new SpareCoins.Address();
    expect( address.validate() ).to.eq( true );

    // todo: Add in privateKey verification
    expect( address.getPrivateKey().constructor ).to.eq( String );
    done();
  } );

  it( "correctly generates hash160", function( done ) {
    // Src: https://blockchain.info/address/15BHe7Lbi9BfjY2qvkC6DBSWXMowXiGBZh
    var address = new SpareCoins.Address( "15BHe7Lbi9BfjY2qvkC6DBSWXMowXiGBZh" );
    expect( address.toHash160() ).to.equal( "2dd28d8f83e8dd026720289825a32d2a5e5c87b3" );
    done();
  } );
} );

describe( "Util", function() {
  it( "sums Unspents", function() {

  } );
} )
