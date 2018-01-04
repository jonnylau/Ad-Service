const knex = require('../db/knex.js');
const Promise = require('bluebird');

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// config
AWS.config.loadFromPath('./config.json');

// Create an SQS service object
var sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

var queueURL = "https://sqs.us-east-2.amazonaws.com/077422758482/thesis";

var params = {
  AttributeNames: [
    "SentTimestamp"
  ],
  MaxNumberOfMessages: 10,
  MessageAttributeNames: [
    "All"
  ],
  QueueUrl: queueURL,
  VisibilityTimeout: 30,
  WaitTimeSeconds: 0
};

const recieveMessage = function() {
  sqs.receiveMessage(params, function (err, data) {
    if (err) {
      console.log("Receive Error", err);
    } else if (data.Messages) {
      for (message of data.Messages) {
        console.log(message.MessageAttributes.videoId.StringValue);
        let targetVideo = parseInt(message.MessageAttributes.videoId.StringValue);
        // Adding to the DB
        knex('videos').where('video_id', '=', targetVideo).increment('view_count', 1)
          .then((success) => {
            knex('videos').where({ video_id: targetVideo })
              .then((video) => {
                if (!video[0].ad && video[0].view_count === 200) {
                  let category = Math.random() > 0.5 ? type = 'comedy' : 'informational';
                  knex.raw(`SELECT ad_id FROM ads WHERE category = '${category}' ORDER BY RANDOM() LIMIT 1`)
                    .then((ad) => {
                      knex('videos').where('video_id', '=', targetVideo).update({ 'ad': ad.rows[0].ad_id })
                        .then((testVideo) => {
                          //console.log('added an ad to a video');
                        });
                    });
                } else {
                  //console.log('added an ad to a video');
                }
              });
          });
        let deleteParams = {
          QueueUrl: queueURL,
          ReceiptHandle: message.ReceiptHandle
        };
        sqs.deleteMessage(deleteParams, function (err, data) {
          if (err) {
            throw err;
          } else {
            console.log("Message Deleted", data);
          }
        });
      }
    }
  });
};

setInterval(recieveMessage, 5000);