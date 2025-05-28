const { tables } = require('..');

module.exports = {
  seed: async (knex) => {
    await knex(tables.auteur).delete(); // 👈 2

    await knex(tables.auteur).insert([
      {
        id: 1,
        voornaam: 'Bart',
        achternaam: 'Van Damme',
        geboortedatum: '1989-01-01',
        biografie: 'Bart is een ervaren schrijver en heeft al meer dan 20 boeken op zijn naam staan.',
        
      },
    ]); 
  },
};
