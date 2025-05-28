const { tables } = require('..');

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.user, (table) => {
      table.increments('id');
      table.string('username', 255).notNullable();
      table.string('voornaam', 255).notNullable();
      table.string('achternaam', 255).notNullable();
      table.dateTime('geboortedatum').notNullable();
      table.string('email', 255).notNullable();
      table.unique( 'username');
      
      table.unique('email', 'idx_user_email_unique');

    });
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists(tables.user);
  },
};
