const { tables } = require('..');

module.exports = {
  seed: async (knex) => {
    await knex(tables.reservatie).delete(); // 👈 2

    await knex(tables.reservatie).insert([
      {
        id: 1,
        begindatum: new Date('2023-11-11'),
        einddatum: new Date('2023-12-21'),
        user_id: 1,
        boek_id: 1,
        
      },
    ]);
  },
};
