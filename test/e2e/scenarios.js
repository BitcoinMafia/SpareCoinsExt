'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

angular.scenario.dsl( 'dummy', function() {
  return function( bool ) {
    return this.addFuture( 'dummy', function( done ) {

      done( null, dummy );

    } );
  };
} );

angular.scenario.dsl( 'getPasswordDigest', function() {
  return function( storage ) {
    return this.addFutureAction( 'password digest from storage', function( win, doc, done ) {
      storage.get( "security", function( data ) {
        if ( data === undefined || data === "" ) {
          done()
        } else {
          done( undefined, data[ "passwordDigest" ] );
        }
      } );
    } );
  }
} );

describe( 'spApp', function() {

  beforeEach( function() {
    // Resets entire wallet (private keys, cache ...)
    chrome.storage.local.clear()
  } )

  describe( 'First Time User', function() {

    beforeEach( function() {
      browser().navigateTo( '/index.html#/' );
      sleep( 0.1 )
    } );

    it( 'should redirect to /password', function() {

      expect( browser().location().url() ).toContain( "password" )

    } );

    it( "should not have passwordDigest in Chrome Storage", function( done ) {
      var passwordDigest = getPasswordDigest( SpareCoins.ChromeStorage );
      expect( passwordDigest ).toBe( undefined )
      expect( passwordDigest ).not().toBe( "" )
    } )

    it( 'should not let you confirm if your password confirmation doesnt match', function() {
      input( 'password' ).enter( "correcthorse" )
      input( 'passwordConfirm' ).enter( "correctsheep" )
      element( "#password-submit" ).click()

      expect( element( ".has-error" ).count() ).toBeGreaterThan( 0 )
      expect( element( ".has-info" ).count() ).toBe( 0 )
      expect( browser().location().url() ).toContain( "password" )
      expect( browser().location().url() ).not().toContain( "receive" )
    } )

    it( 'should redirect to /send after setting correct password', function() {
      input( 'password' ).enter( "correcthorse" )
      input( 'passwordConfirm' ).enter( "correcthorse" )
      element( "#password-submit" ).click()
      sleep( 0.1 )
      expect( browser().location().url() ).not().toContain( "password" )
      expect( browser().location().url() ).toContain( "receive" )
    } )

  } )

  describe( 'Signed up User', function() {

    beforeEach( function() {
      browser().navigateTo( '/index.html#/' );
      sleep( 0.2 )
      input( 'password' ).enter( "correcthorse" )
      input( 'passwordConfirm' ).enter( "correcthorse" )
      element( "#password-submit" ).click()
      sleep( 0.1 )
    } );

    it( 'should have stored passwordDigest in ChromeStorage after password confirmation', function() {
      var passwordDigest = getPasswordDigest( SpareCoins.ChromeStorage );
      var digestCheck = Crypto.SHA256( "correcthorse" )

      expect( passwordDigest ).not().toBe( undefined )
      expect( passwordDigest ).toBe( digestCheck )

    } )

    it( 'should automatically generate a new address', function() {
      sleep( 0.2 )
      // match at least 22 characters
      expect( element( "#current-address textarea" ).text() ).toMatch( /.{22,}/ )
    } )

    it( 'should redirect to /receive not stay on password', function() {
      expect( browser().location().url() ).not().toContain( "password" )
      expect( browser().location().url() ).toContain( "receive" )
    } );

    // TODO: How to test if same element changed? They're both futures
    it( 'should be able to generate addresses', function() {
      sleep( 0.1 )
      var firstAddress = element( "#current-address textarea" ).text()
      expect( firstAddress ).toMatch( /.{22,}/ )
      sleep( 0.1 )
      element( "#generate-address" ).click()
      var secondAddress = element( "#current-address textarea" ).text()
      sleep( 0.1 )
      expect( secondAddress ).toMatch( /.{22,}/ )
      expect( firstAddress ).toBe( secondAddress )
    } )

    it( 'should be able to log out', function() {
      element( "#settings" ).click()
      element( "#logout" ).click()
      sleep( 0.1 )
      expect( browser().location().url() ).toContain( "login" )
    } )

    it( 'should have password digest before logout', function() {

      var passwordDigest = getPasswordDigest( SpareCoins.ChromeStorage );
      expect( passwordDigest ).toMatch( /.{22,}/ )

      element( "#settings" ).click()
      element( "#logout" ).click()
    } )

    it( 'should clear password digest after logout', function() {
      element( "#settings" ).click()
      element( "#logout" ).click()
      sleep( 0.1 )

      var passwordDigest = getPasswordDigest( SpareCoins.ChromeStorage );
      expect( passwordDigest ).toBe( undefined )

    } )

    it( "should have passwordDigest on re login", function() {
      element( "#settings" ).click()
      element( "#logout" ).click()
      sleep( 0.1 )

      browser().navigateTo( "/index.html#/" );
      sleep( 0.1 )
      expect( browser().location().url() ).toContain( "login" )
      input( "password" ).enter( "correcthorse" )
      element( "#login-submit" ).click()
      sleep( 0.1 )

      // means it's authenticated
      expect( browser().location().url() ).toContain( "send" )
      var passwordDigest = getPasswordDigest( SpareCoins.ChromeStorage );
      var digestCheck = Crypto.SHA256( "correcthorse" )

      expect( passwordDigest ).not().toBe( undefined )
      expect( passwordDigest ).toBe( digestCheck )
    } )

    it( 'should display balance to be 0', function() {
      browser().navigateTo( '/index.html#/' );
      sleep( 1 )
      expect( browser().location().url() ).toContain( "send" )
      var bal = element( "#balance" ).text()
      expect( bal ).toContain( "0" )
    } )

  } )

  describe( "Second Time User", function() {
    beforeEach( function() {
      browser().navigateTo( '/index.html#/' );
      sleep( 0.2 )
      input( 'password' ).enter( "correcthorse" )
      input( 'passwordConfirm' ).enter( "correcthorse" )
      element( "#password-submit" ).click()
      sleep( 0.1 )

      browser().reload()
      browser().navigateTo( "/index.html#/" )
      sleep( 0.1 )

    } )

    it( "should redirect to the /send page", function() {
      expect( browser().location().url() ).toContain( "send" )
    } )

    it( "shoud display the balance to be 0", function() {
      sleep( 2 )
      var bal = element( "#balance" ).text()
      expect( bal ).toContain( "0" )
    } )

    it( "should store address and amount temporarily", function() {
      input( "inputAddress" ).enter( "bitcoinaddress" )
      input( "inputAmount" ).enter( 0.1337 )
      // triggers validation, which stores inputs in ChromeStorage
      element( "#send-submit" ).click()
      sleep( 0.1 )
      browser().reload()
      browser().navigateTo( "/index.html#/" )
      sleep( 0.1 )
      expect( input( "inputAddress" ).val() ).toBe( "bitcoinaddress" )
      expect( input( "inputAmount" ).val() ).toBe( "0.1337" )
    } )

  } )

  describe( "Send Transaction", function() {
    beforeEach( function() {
      browser().navigateTo( '/index.html#/' );
      sleep( 0.2 )
      input( 'password' ).enter( "correcthorse" )
      input( 'passwordConfirm' ).enter( "correcthorse" )
      element( "#password-submit" ).click()
      sleep( 0.1 )
      browser().navigateTo( '/index.html#/' );
      sleep( 0.1 )
    } )

    it( "should not send if not btc address", function() {
      input( "inputAddress" ).enter( "notAbTcAdreesszzYO!" )
      element( "#send-submit" ).click()
      expect( element( ".control-label" ).text() ).toContain( "Invalid address" )
    } )

    it( 'should not send if amount is 0', function() {
      input( "inputAmount" ).enter( 0 )
      element( "#send-submit" ).click()
      expect( element( ".control-label" ).text() ).toContain( "above 0" )
    } )

    // TODO: Need to mock out balance
    it( 'should not send if amount is above balance', function() {
      input( "inputAmount" ).enter( 2 )
      element( "#send-submit" ).click()
      expect( element( ".control-label" ).text() ).toContain( "Not enough in balance" )
    } )

    it( 'should highlight red if address incorrect', function() {
      expect( element( ".has-info" ).count() ).toBeGreaterThan( 0 )
      expect( element( ".has-error" ).count() ).toBe( 0 )
      input( "inputAddress" ).enter( "notAbTcAdreesszzYO!" )
      element( "#send-submit" ).click()
      expect( element( ".has-error" ).count() ).toBeGreaterThan( 0 )
    } )

    it( 'should highlight red if amount incorrect', function() {
      expect( element( ".has-info" ).count() ).toBeGreaterThan( 0 )
      expect( element( ".has-error" ).count() ).toBe( 0 )
      input( "inputAmount" ).enter( 0 )
      element( "#send-submit" ).click()
      expect( element( ".has-error" ).count() ).toBeGreaterThan( 0 )
    } )

    it( "should include miner fees in send amount", function() {
      input( "inputAmount" ).enter( 0.001 )
      expect( element( "#send-submit" ).text() ).toContain( "0.0011" )
      input( "inputAmount" ).enter( 1.3 )
      expect( element( "#send-submit" ).text() ).toContain( "1.3001" )
    } )

    // TODO: Need to mock out balance
    it( "should click to confirm if address/amount correct", function() {
      expect( dummy( false ) ).toBe( true )
    } )

    // TODO: Need to mock out balance
    it( "should change back for normal from click to confirm if changed", function() {
      expect( dummy( false ) ).toBe( true )
    } )
  } )

} )
