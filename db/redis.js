var environment = process.env.NODE_ENV || 'development';
var config = require('../redisfile.js')[environment.connection];
var redis = require('redis');

module.exports = redis.createClient(config);  