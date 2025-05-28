const { tables } = require('..');

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.reservatie, (table) => {
      table.increments('id');
      table.dateTime('begindatum').notNullable();
      table.dateTime('einddatum').notNullable();
      table.integer('user_id').unsigned().notNullable();
      table.integer('boek_id').unsigned().notNullable();
      table.unique('begindatum', 'idx_reservatie_begindatum_unique');
      table.unique('einddatum', 'idx_reservatie_einddatum_unique');
      table
        .foreign('user_id', 'fk_user_reservatie')
        .references('id')
        .inTable(tables.user)
        .onDelete('CASCADE');
      table
        .foreign('boek_id', 'fk_boek_reservatie')
        .references('id')
        .inTable(tables.boek)
        .onDelete('CASCADE');
    });
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists(tables.reservatie);
  },
};
