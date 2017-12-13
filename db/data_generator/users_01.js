var knex = require('../knex');
var faker = require('faker');

let makeUsers = () => {
  let userData = [];
  for (let i = 0; i <= 5000000; i++) {
    let record = {};
    record.name = faker.name.findName();
    userData.push(record);
  }
  return userData;
};

var data = makeUsers();
var chunkSize = 1000;

// knex('users').del()
//   .then(
knex.batchInsert('users', data, chunkSize)
  .then((results) => {
    console.log('SUCCESSFUL INSERTION');
    process.exit();
  })
  .catch((error) => {
    return error;
  });
// );
//====================================================================
//            INSERT ONE TEST
//====================================================================
// knex('users').insert({ name: 'Kiyeon' })
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