var redisClient = require('../db/redis.js');
const queue = require('kue').createQueue();

queue.watchStuckJobs(6000);

console.log('hello world');

queue.on('ready', () => {
  console.info('Queue is ready!');
});

queue.on('error', (err) => {
  console.log('There was an error in the queue');
  console.log(err);
  console.log(err.stack);
});