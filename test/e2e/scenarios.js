'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */
console.log( "starting test ..." )

angular.scenario.dsl( 'getPasswordDigest', function() {
  return function( storage ) {
    return this.addFutureAction( 'getting password digest from storage', function( win, doc, done ) {
      storage.get( "security", function( data ) {
        done( undefined, data );
      } );
    } );
  }
} );

describe( 'UserAuth Scenarios', function() {

  beforeEach( function() {
    chrome.storage.local.clear()
  } )

  describe( 'First Time User', function() {

    beforeEach( function() {
      browser().navigateTo( '/index.html#/' );
      sleep( 1 )
    } );

    it( 'should redirect to /password', function() {

      expect( browser().location().url() ).toContain( "password" )

    } );

    it( "should not have password in Chrome Storage", function( done ) {
      var passwordDigest = getPasswordDigest( SpareCoins.ChromeStorage );
      expect( passwordDigest ).toBe( undefined )
    } )

  } )

  it( 'should not let you confirm if your password confirmation doesnt match', function() {

  } )

  it( 'should redirect to /send after settign correct password', function() {

  } )

} )

describe( 'Signed up User', function() {

  beforeEach( function() {
    browser().navigateTo( '/index.html#/' );
  } );

  it( 'should redirect to /password if first time user', function() {
    sleep( 1 )
    expect( browser().window().href() ).toContain( "password" )

  } );

  it( 'should redirect to /login if not logged in', function() {

  } )

  it( 'should redirect to /send if logged in', function() {

  } )

} )

// describe( 'First Time User', function() {

// beforeEach( function() {
//   browser().navigateTo( '/index.html#/' );
// } );

// it( 'should redirect to /password if first time user', function() {
//   sleep( 1 )
//   expect( browser().window().href() ).toContain( "password" )

// } );

// it( 'should redirect to /login if not logged in', function() {

// } )

// it( 'should redirect to /send if logged in', function() {

// } )

// } )

// } );
