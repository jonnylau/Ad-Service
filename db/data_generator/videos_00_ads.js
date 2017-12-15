var knex = require('../knex');

let categories = [
];

let makeVideos = () => {
  let videoData = [];
  
  for (let i = 0; i <= 999999; i++) {
    let record = {};
    record.category = null;
    record.length = Math.random() > 0.5 ? 15000 : 30000; // 15 or 30 seconds
    record.view_count = Math.floor(Math.random() * 100);
    record.likes = Math.floor(Math.random() * 100);
    record.user_id = null;
    record.is_ad = true;
    record.ad = null;
    videoData.push(record);
  }
  return videoData;
};

var data = makeVideos();
var chunkSize = 1000;

//console.log(data);
knex.batchInsert('videos', data, chunkSize)
  .then((results) => {
    console.log('SUCCESSFUL INSERTION');
    process.exit();
  })
  .catch((error) => {
    console.log(error);
    process.exit();
  });