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

//==========================================================================
//                            TEST ROUTES
//==========================================================================
app.get('/videos', (req, res) => {
  res.status(200).send('hello world');
});

app.get('/users', (req, res) => {
  knex.select().from('users').where('user_id', 1)
    .then( (user) => {
      res.status(200).send(user);
    });
});

//==================================================================

// let count = knex()
// res.status(200).send('Successful update');
// if the video's view count > 200 and does not have a video
// find the count of the ads table and assign it a random one
// ^^ costly

app.post('/updateCount', (req, res) => {
  let type;
  let targetVideo = req.body.videoId;
  
  return new Promise( (resolve, reject) => {
    resolve(knex('videos').where('video_id', '=', targetVideo).increment('view_count', 1)
      .then( (success) => {
        knex('videos').where({ video_id: targetVideo}).first()
          .then((video) => {
            if (!video.ad && video.view_count < 200) {
              let category = Math.random() > 0.5 ? type = 'comedic' : 'informational';
              knex.raw(`select count(*) from ads where category = '${category}'`)
                .then((count) => {
                  //update the videoID's adID
                  res.status(200).send(count.rows[0].count);
                });
            }
          });
      })
    ).catch((err) => {
      console.log(err);
    });
  }); 
}); 

app.get('/testSimple', (req, res) => {
  let category = 'comedy';
  knex.raw(`select count(*) from ads where category = '${category}'`)
    .then((count) => {
      res.status(200).send(count);
    });
});

/*
knex.raw('SELECT COUNT(*) FROM ads')
    .then((count) => {
      res.status(200).send(count);
    });
knex.select('*').from('ads').where({ category: 'comedy' }).limit(10)
  .then((ads) => {
    res.status(200).send(ads);
  });
*/


// ======================================================================
//                    Run Server
// ======================================================================
if (!module.parent) { // only listen to port if existing port is not in use
  app.listen(PORT, () =>{
    console.log('Listening on port', PORT);
  });
}

module.exports = app;