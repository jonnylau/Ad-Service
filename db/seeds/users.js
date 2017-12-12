
exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('users').del(), 

    // Inserts seed entries
    knex('users').insert({name: 'Jin'}),
    knex('users').insert({name: 'Toby'}),
    knex('users').insert({name: 'Andrew'}),
  );
};
