const { tables } = require('..');

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.boek, (table) => {
      table.increments('id');
      table.string('titel').notNullable();
      table.integer('auteur_id').unsigned().notNullable();
      table.integer('genre_id').unsigned().notNullable();
      table.date('release_datum').notNullable();
      table.string('isbn').unique();
      table.string('taal', 10).notNullable();
      table.integer('aantal_paginas').notNullable();
      table.string('uitgever', 255).notNullable();

      table
      .foreign('auteur_id', 'fk_auteur_boek')
      .references('id')
      .inTable(tables.auteur)
      .onDelete('CASCADE');

      table
      .foreign('genre_id', 'fk_genre_boek')
      .references('id')
      .inTable(tables.genre)
      .onDelete('CASCADE');

    });
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists(tables.boek);
  },
};
