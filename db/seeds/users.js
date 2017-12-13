
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {id: 1, colName: 'Jin'},
        {id: 2, colName: 'Andrew'},
        {id: 3, colName: 'Kiyeon'}
      ]);
    });
};
