'use strict';

/* jasmine specs for services go here */

describe('service', function() {

  beforeEach(module('spApp'));

  describe('BlockchainInfo', function() {

    var blockchainInfo;
    var $http;
    var $httpBackend;

    beforeEach(inject(function (_$http_, _$httpBackend_, _blockchainInfo_) {
      blockchainInfo = _blockchainInfo_;
      $http = _$http_
      $httpBackend = _$httpBackend_
    }))

    it('should have a default root with the correct URL', function() {
      var root = blockchainInfo.root
      expect(root).toBe("https://blockchain.info/")
    })

    // http://docs.angularjs.org/api/ngMock.$httpBackend
    // it('should have return a callback', function() {
    //   var obj = 0
    //   var addresses = ["1FmdeybWTUsPj3QzDw3Y2X5YZNunugpcnA"]

    //   $http.get("http://www.google.com")
    //     .success(function() {
    //       console.log("SUCCESS")
    //     })
    //     .error(function() {
    //       console.log("error")
    //     })

    //   blockchainInfo.multiaddr(addresses, function(err, data) {
    //     obj = 1
    //   })

    //   waitsFor(function() {
    //     obj === 1
    //   })

    //   runs(function() {
    //     expect(obj).toBe(1)
    //   })

    // })

    it('should test $http', function() {
      console.log($http)
      console.log($httpBackend)
    })


  });
});
