// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');

// Config settings
// require('dotenv').config();
AWS.config.loadFromPath('./config.json');

// Set the region 
//AWS.config.update({ region: 'us-east-2' });

// Create an SQS service object
var sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

for (let i = 0; i < 10; i++) {
  let videoId = Math.ceil( Math.random() * 10000000).toString();
  var params = {
    DelaySeconds: 10,
    MessageAttributes: {
      "videoId": {
        DataType: "Number",
        StringValue: "videoId"
      }
    },
    MessageBody: "None",
    QueueUrl: "https://sqs.us-east-2.amazonaws.com/077422758482/thesis"
  };

  sqs.sendMessage(params, function (err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", data.MessageId);
    }
  });
}