var knex = require('../knex');
var faker = require('faker');

let userData = [];

let makeUsers = () => {
  for (let i = 0; i < 100; i++) {
    let record = {};
    record.name = faker.name.findName();
    userData.push(record);
  }
};

makeUsers();
//console.log(userData);

var chunkSize = 10;

knex.batchInsert('users', userData, chunkSize)
  .then((results) => {
    console.log('SUCCESSFUL INSERTION')
  })
  .catch((error) => {
    return error;
  });

//====================================================================
//            INSERT ONE TEST
//====================================================================
// knex('users').insert({ name: 'Jon' })
//   .then((result)=>{
//     return (result);
//   });
//====================================================================
//            GETTING FIRST USER TEST
//====================================================================

// knex.select().from('users').where('user_id', 1)
//   .then((user, err) => {
//     if (err) {
//       console.log('Error', err);
//     } else {
//       console.log(user);
//     }
//   });