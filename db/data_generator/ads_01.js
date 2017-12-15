var knex = require('../knex');

let categories = [
  'comedy',
  'informational'
];

let makeAds = () => {
  let Ads = [];
  for (let i = 1; i <= 999999; i++) {
    let record = {};
    // make some fake categories
    record.category = categories[Math.floor( Math.random() * 2 )];
    record.banner = 'urlString'; // milliseconds
    record.link = 'urlString';
    record.video_id = i;
    record.tier = Math.ceil( Math.random() * 10 );
    Ads.push(record);
  } 
  return Ads;
};

var data = makeAds();
var chunkSize = 1000;

//console.log(data);
knex.batchInsert('ads', data, chunkSize)
  .then((results) => {
    console.log('SUCCESSFUL INSERTION');
    process.exit();
  })
  .catch((error) => {
    console.log(error);
    process.exit();
  });