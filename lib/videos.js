const knex = require('../db/knex.js');
const Promise = require('bluebird');
const redis = require('redis');
const queue = require('kue').createQueue();

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

let createQueueItem = (targetVideo) => {
  queue.create('ad', {
    video_id: targetVideo
  })
    .priority('medium')
    .removeOnComplete(true)
    .save((err) => {
      if (!err) {
        res.status(204).end();
      } else {
        logger.error(err);
        res.end();
      }
    });
};

let updateViewCount = (targetVideo) => {
  queue.process('ad', (job, done) => {
    var targetVideo = job.data.video_id;

    return new Promise((resolve, reject) => {
      resolve(knex('videos').where('video_id', '=', targetVideo).increment('view_count', 1)
        .then((success) => {
          knex('videos').where({ video_id: targetVideo })
            .then((video) => {
              if (!video[0].ad && video[0].view_count === 200) {
                let category = Math.random() > 0.5 ? type = 'comedy' : 'informational';
                knex.raw(`SELECT ad_id FROM ads WHERE category = '${category}' ORDER BY RANDOM() LIMIT 1`)
                  .then((ad) => {
                    knex('videos').where('video_id', '=', targetVideo).update({ 'ad': ad.rows[0].ad_id })
                      .then((testVideo) => {
                        done();
                        // res.status(200).send(video);
                      });
                  });
              } else {
                done();
                //res.status(200).send(video);
              }
            });
        })
      ).catch((err) => {
        throw err;
      });
    });
  
  });
};

module.exports = {
  updateViewCount: updateViewCount,
  createQueueItem: createQueueItem
};