const { tables } = require('..');

module.exports = {
  seed: async (knex) => {
    await knex(tables.boek).delete(); // 👈 2

    await knex(tables.boek).insert([
      {
        id: 1,
        titel: 'De aanslag',
        auteur_id: 1,
        genre_id: 1,
        release_datum: '1982-01-01',
        isbn: '9789023466799',
        taal: 'Nederlands',
        aantal_paginas: 300,
        uitgever: 'De Bezige Bij',
            
      },
    ]); 
  },
};
