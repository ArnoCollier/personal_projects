const { tables } = require('..');

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.auteur, (table) => {
      table.increments('id');
      table.string('voornaam', 255).notNullable();
      table.string('achternaam', 255).notNullable();
      table.dateTime('geboortedatum').notNullable();
      table.text('biografie');
    });
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists(tables.auteur);
  },
};
