const { tables } = require('..');

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.genre, (table) => {
        table.increments('id');
        table.string('naam', 255).notNullable();
        }
    ); 
    },
    down: (knex) => {
        return knex.schema.dropTableIfExists(tables.genre);
    }
};