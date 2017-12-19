const cluster = require('cluster');

if (cluster.isMaster) {
  var cpuCount = require('os').cpus().length;
  
  for (var i = 0; i < cpuCount; i += 1) {
    cluster.fork();
  }

} else {
  const express = require('express');
  const bodyParser = require('body-parser');
  const PORT = process.env.PORT || 3000;
  var knex = require('../db/knex.js');
  //var bookshelf = require('bookshelf')(knex);
  //var Video = require('./models/videos.js');

  const request = require('request');
  const Promise = require('bluebird');
  var app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  app.patch('/service', (req, res) => {
    let type;
    let targetVideo = req.body.videoId;

    return new Promise((resolve, reject) => {
      resolve(knex('videos').where('video_id', '=', targetVideo).increment('view_count', 1)
        .then((success) => {
          knex('videos').where({ video_id: targetVideo }).first()
            .then((video) => {
              if (!video.ad && video.view_count === 65200) {
                let category = Math.random() > 0.5 ? type = 'comedy' : 'informational';
                knex.raw(`SELECT ad_id FROM ads WHERE category = '${category}' ORDER BY RANDOM() LIMIT 1`)
                  .then((ad_Id) => {
                    knex('videos').where('video_id', '=', targetVideo).update({ 'ad': ad_Id.rows[0].ad_id })
                      .then((testVideo) => {
                        res.status(200).send({ 'video': video, 'ad_Id': ad_Id.rows[0].ad_id, 'messsage': 'added an Ad' });
                      });
                  });
              } else {
                res.status(200).send({ 'video': video, 'messsage': 'updated count only' });
              }
            });
        })
      ).catch((err) => {
        console.log(err);
      });
    });
  }); 
  
  if (!module.parent) { // only listen to port if existing port is not in use
    app.listen(PORT, () => {
      console.log('Listening on port', PORT);
    });
  }
}