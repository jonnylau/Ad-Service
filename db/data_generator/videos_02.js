var knex = require('../knex');

let categories = [
  'Auto & Vehicles',
  'Beauty & Fashion',
  'Comedy',
  'Education',
  'Entertainment',
  'Family Entertainment',
  'Film & Animation',
  'Food',
  'Gaming',
  'How - to & Style',
  'Music',
  'News & Politics',
  'Nonprofits & Activism',
  'People & Blogs',
  'Pets & Animals',
  'Science & Technology',
  'Sports',
  'Travel & Events'
];

let makeVideos = () => {
  let videoData = [];
  for (let i = 5000001; i <= 10000000; i++) {
    let record = {};

    record.category = categories[Math.floor( Math.random() * categories.length )];
    record.length = Math.floor(Math.random() * 1800000); // milliseconds
    record.view_count = Math.floor(Math.random() * 1000);
    record.likes = Math.floor(Math.random() * 100);
    record.user_id = i;
    record.is_ad = false;
    record.ad = Math.ceil(Math.random() * 1000000);
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