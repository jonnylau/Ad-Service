const express = require('express');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
var knex = require('../db/knex.js');
//var bookshelf = require('bookshelf')(knex);
//var Video = require('./models/videos.js');

const app = express();

//const db = require('./db'); //db.js file to run everytime our server starts

const request = require('request');
const Promise = require('bluebird');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(express.static(__dirname + '/../client/dist'));

app.get('/videos', (req, res) => {
  res.status(200).send('hello world');
});

app.get('/users', (req, res) => {
  knex.select().from('users').where('user_id', 1)
    .then( (user) => {
      res.status(200).send(user);
    });
});

app.post('/updateCount', (req, res) => {
  let videoId = req.body.videoId;
  knex('videos').where('video_id', '=', videoId).increment('view_count', 1)
    .then( (success) => {
      // res.status(200).send('Successful update');
      // if the video's view count > 200 and does not have a video
      // find the count of the ads table and assign it a random one
      // ^^ costly
      //
    })
    .catch( (err) => {
      console.log(err);
    });
});

// ======================================================================
//                    Run Server
// ======================================================================
if (!module.parent) { // only listen to port if existing port is not in use
  app.listen(PORT, () =>{
    console.log('Listening on port', PORT);
  });
}

module.exports = app;