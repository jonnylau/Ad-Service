
exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('users').del(), 

    // Inserts seed entries
    knex('users').insert({id: 1, colName: 'Jin'}),
    knex('users').insert({id: 2, colName: 'Toby'}),
    knex('users').insert({id: 3, colName: 'Andrew'}),
  );
};
