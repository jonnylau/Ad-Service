var expect = require('chai').expect;
var server = require('../server/index.js');
var request = require('supertest');
//var db = require('../lib/videos.js');

// ======================================================================
//                   Server Tests
// ======================================================================
describe('Server Handles Requests', function () {
  this.timeout(10000);  

  describe('Server - Test for response', function () {
    describe('GET ', function () {
      it('should return hello world', (done) => {
        request(server) 
          .get('/videos')
          .expect(200, done);
      });
    });
  });

  describe('Server - Test Query Return', function () {
    describe('QUERY', function () {
      it('should return an array', (done) => {
        request(server)
          .get('/users')
          .set('Accept', 'application/json')
          .expect((res) => {
            typeof (res.body) === 'array';
          })
          .expect(200, done);
      });
    });
  });

  describe('Server - Add One to Video Count', function() {
    describe('POST', function() {
      it('should update a video\'s view count by ONE', (done) => {
        request(server)
        // get the view count of a video
        // call on /updateCount
        // get the count of the same video
        // test if it has incremented by one
          .post('/updateCount')
          .set('Accept', 'application/json')
          .send('videoId', '1000000')
          .expect(200, done);            
      });
    });
  });

});

// after(function (done) {
//   server.close(done);
// });