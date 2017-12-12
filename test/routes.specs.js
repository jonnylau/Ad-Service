var expect = require('chai').expect;
var server = require('../server.js');
var request = require('supertest');

// ======================================================================
//                   Server Tests
// ======================================================================
describe('Server Handles Requests', function () {
  //timeout extended
  this.timeout(8000);

  describe('server', function () {
    describe('GET ', function () {
      it('should return hello world', (done) => {
        // just assume that if it contains an <input> tag its index.html
        request(server) //??? 
          .get('/videos')
          .expect(200, done);
      });
    });
  });
});
















