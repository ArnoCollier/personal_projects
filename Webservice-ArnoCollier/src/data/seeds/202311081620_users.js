const { tables } = require('..');
const Role = require('../../core/roles');

module.exports = {
  seed: async (knex) => {
    await knex(tables.user).delete(); 

    await knex(tables.user).insert([
      {
        id: 1,
        username: 'ArnoCollier',
        voornaam: 'Arno',
        achternaam: 'Collier',
        email: 'arno.collier@telenet.be',
        geboortedatum: '2003-10-15',
        password_hash:
          '$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4',
        roles: JSON.stringify([Role.ADMIN, Role.USER]),
      },
      {
        id: 2,
        username: 'KlaasHuy',
        voornaam: 'Klaas',
        achternaam: 'Huybrechts',
        email: 'Klaas.Huy@gmail.com',
        geboortedatum: '1997-04-20',
        password_hash:
          '$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4',
        roles: JSON.stringify([Role.USER]),
      },
    ]);
  },
};
