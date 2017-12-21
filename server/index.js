const cluster = require('cluster');

if (cluster.isMaster) {
  var cpuCount = require('os').cpus().length;
  
  for (var i = 0; i < cpuCount; i += 1) {
    cluster.fork();
  }

} else {
// =============== ELASTIC SEARCH + KIBANA =======================================================
//   var apm = require('elastic-apm-node').start({
//     appName: 'youtube',
//     // Use if APM Server requires a token
//     // Set custom APM Server URL (default: http://localhost:8200)
//     serverUrl: 'http://localhost:8200'
//   });
// ============================================================================================================

  const express = require('express');
  const bodyParser = require('body-parser');
  const PORT = process.env.PORT || 3000;
  var knex = require('../db/knex.js');

  var redis = require('redis');

  const queue = require('kue').createQueue();
  queue.watchStuckJobs(6000);
  
//=================================================
  const request = require('request');
  const Promise = require('bluebird');
  var app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  app.patch('/service', (req, res) => {
    
    let targetVideo = req.body.videoId;
  
    queue.create('ad', {
      video_id: targetVideo
    }).save((err) => {
      if (!err) {
        res.status(200).send(targetVideo);
      } else {
        throw err;
      }
    });            
  });

  queue.process('ad', (job, done) => {
    var targetVideo = job.data.video_id;

    return new Promise((resolve, reject) => {
      resolve(knex('videos').where('video_id', '=', targetVideo).increment('view_count', 1)
        .then((success) => {
          knex('videos').where({ video_id: targetVideo })
            .then((video) => {
              if (!video[0].ad && video[0].view_count === 339510) {
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

  // var job = queue.create('ad', {
  //   video_id: targetVideo
  // }).save( (err) => {
  //   if(!err) console.log( job.id );
  // });

  // return new Promise((resolve, reject) => {
  //   resolve(knex('videos').where('video_id', '=', targetVideo).increment('view_count', 1)
  //     .then((success) => {
  //       knex('videos').where({ video_id: targetVideo })
  //         .then((video) => {
  //           if (!video[0].ad && video[0].view_count === 339510) {
  //             let category = Math.random() > 0.5 ? type = 'comedy' : 'informational';
  //             knex.raw(`SELECT ad_id FROM ads WHERE category = '${category}' ORDER BY RANDOM() LIMIT 1`)
  //               .then((ad) => {
  //                 knex('videos').where('video_id', '=', targetVideo).update({ 'ad': ad.rows[0].ad_id })
  //                   .then((testVideo) => {
  //                     res.status(204).end();
  //                   });
  //               });
  //           } else {
  //             res.status(204).end();
  //           }
  //         });
  //     })
  //   ).catch((err) => {
  //     throw err;
  //   });
  // });

  // }); 

  app.post('/count', (req, res) => {
    let targetVideo = req.body.videoId;

    return new Promise((resolve, reject) => {
      resolve(knex('videos').where({ video_id: targetVideo })
        .then((video) => {
          res.status(200).send(video);
        })
      ).catch((err) => {
        console.log(err);
      });
    });
  });

  app.get('/kue', (req, res) => {
    res.status(200).end();
  });

  if (!module.parent) { // only listen to port if existing port is not in use
    app.listen(PORT, () => {
      console.log('Listening on port', PORT);
    });
  }
}