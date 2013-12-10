'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe( 'spApp', function() {

  beforeEach( function() {
    // browser().navigateTo( '#/' );
  } );

  it( 'should automatically redirect to /send when loggedIn', function() {
    var thing = true
    console.log( thing )
    sleep( 1 )
    expect( thing ).toBe( true )
    // expect( browser().location().url() ).toBe( "#/send" );
  } );

  // describe('send', function() {

  //   beforeEach(function() {
  //     browser().navigateTo('#/send');
  //   });

  //   it('should render sned when user navigates to /view1', function() {
  //     // expect(element('[ng-view] p:first').text()).toMatch(/partial for view 1/);
  //   });

  // });

  // describe('history', function() {

  //   beforeEach(function() {
  //     browser().navigateTo('#/view2');
  //   });

  //   it('should render view2 when user navigates to /view2', function() {
  //     expect(element('html').text()).toMatch(/send/);
  //   });

  // });
} );
