// ====================== CLUSTER =======================================================
const queue = {};

require('newrelic');
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
// ===============================================================================================
  const Winston = require('winston');
  const logger = new Winston.Logger({
    level: 'verbose',
    transports: [
      new Winston.transports.Console({
        timestamp: true
      }),
      new Winston.transports.File({
        filename: 'error.log',
        timestamp: true,
        level: 'error',
      })
    ]
  });
  
  const PORT = process.env.PORT || 3000;  
  //const knex = require('../db/knex.js');
  const knex = require('knex')({
    client: 'pg',
    connection: 'postgres://postgres@172.17.0.3',
  });
  // const redis = require('redis');
  // const queue = require('kue').createQueue();
  // queue.watchStuckJobs(6000);
  
  // =============================================================================================
  const express = require('express');
  const bodyParser = require('body-parser');
  const request = require('request');
  const Promise = require('bluebird');
  const app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  app.patch('/service', (req, res) => {
    
    let targetVideo = req.body.videoId;
    // ======================================================================
    //                                                      REDIS KUE
    //   queue.create('ad', {
    //     video_id: targetVideo
    //   })
    //     .priority('medium')
    //     .removeOnComplete( true )
    //     .save( (err) => {
    //       if (!err) {
    //         res.status(204).end();
    //       } else {
    //         logger.error(err);
    //         res.end();
    //       }
    //     });            
    // });
    
    // queue.process('ad', (job, done) => {
    // var targetVideo = job.data.video_id;
    // ======================================================================
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
                        //done();
                        res.status(204).end();
                      });
                  });
              } else {
                //done();
                res.status(204).end();
              }
            });
        })
      ).catch((err) => {
        throw err;
      });
    });
  });

  // ==================================================================
  //  Load Testing Endpoint 
  // ==================================================================
  
  app.patch('/', (req, res) => {
    res.status(200).send({testMessage: 'hello world'});
  });

  

  app.patch('/test', (req, res) => {
    let targetVideo = req.body.videoId;
    console.log(typeof targetVideo);
    
    if (Object.keys(queue).length < 5) {

      queue[targetVideo] = (queue[targetVideo] || 0) + 1;
      //queue[targetVideo] += 1;

      console.log('keyCount --->', Object.keys(queue).length);
      console.log('queue ---->', queue);
      
      res.status(200).send({message: 'updates recieved'});
    } else {
      let videos = [];
      let views = [];
      
      for (video of Object.keys(queue)) {
        videos.push(video);
      }
      for (video in queue) {
        views.push(queue[video]);
      }
      console.log(videos, views);
      res.status(200).send({ message: 'over threshold' });
      //knex.raw()
      // update tmp set age = data_table.age
      // from
      //   (select unnest(array['keith', 'leslie', 'bexley', 'casey']) as name,
      //   unnest(array[44, 50, 10, 12]) as age) as data_table
      // where tmp.name = data_table.name; 
    }
  });

  if (!module.parent) { // only listen to port if existing port is not in use
    app.listen(PORT, () => {
      console.log('Listening on port', PORT);
    });
  }
}