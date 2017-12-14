var knex = require('../knex');
var faker = require('faker');

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

let makeUsers = () => {
  let userData = [];
  for (let i = 0; i <= 100; i++) {
    let record = {};
    // make some fake categories
    record.category = categories[Math.floor( Math.random() * categories.length )];
    record.length = Math.floor(Math.random() * 1800000); // milliseconds
    //record.popularity = i;
    record.view_count = 0;
    record.likes = Math.floor(Math.random() * 100);
    //record.user_id = i;
    userData.push(record);
  }
  return userData;
};

var data = makeUsers();
var chunkSize = 10;

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