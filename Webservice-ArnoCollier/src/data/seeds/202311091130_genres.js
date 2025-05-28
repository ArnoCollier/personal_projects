const { tables } = require('..');

module.exports = {
  seed: async (knex) => {
    await knex(tables.genre).delete();

    await knex(tables.genre).insert([
        { id: 1, naam: 'Biografie' },
        { id: 2, naam: 'Detective' },
        { id: 3, naam: 'Doktersverhaal' },
        { id: 4, naam: 'Erotiek' },
        { id: 5, naam: 'Familieroman' },
        { id: 6, naam: 'Griezelverhaal' },
        { id: 7, naam: 'Historische roman' },
        { id: 8, naam: 'Humor' },
        { id: 9, naam: 'Oorlog/verzet' },
        { id: 10, naam: 'Psychologisch verhaal' },
        { id: 11, naam: 'Romantisch verhaal' },
        { id: 12, naam: 'Science-fiction' },
        { id: 13, naam: 'Sociaal/politiek verhaal' },
        { id: 14, naam: 'Spanning en avontuur' },
        { id: 15, naam: 'Waargebeurd verhaal' },
        { id: 16, naam: 'Western' },
        { id: 17, naam: 'Zeeverhaal' },
        { id: 18, naam: 'ABC-boek' },
        { id: 19, naam: 'Avonturenverhaal' },
        { id: 20, naam: 'Detective' },
        { id: 21, naam: 'Dierenverhaal' },
        { id: 22, naam: 'Fantasieverhaal' },
        { id: 23, naam: 'Gezinsverhaal' },
        { id: 24, naam: 'Godsdienstig verhaal' },
        { id: 25, naam: 'Griezelverhaal' },
        { id: 26, naam: 'Historisch verhaal' },
        { id: 27, naam: 'Jongensboek' },
        { id: 28, naam: 'Leerboek' },
        { id: 29, naam: 'Meisjesboek' },
        { id: 30, naam: 'Oorlogsverhaal' },
        { id: 31, naam: 'Poëzie' },
        { id: 32, naam: 'Prentenboek' },
        { id: 33, naam: 'Realistisch verhaal' },
        { id: 34, naam: 'Reisverhaal' },
        { id: 35, naam: 'Schoolverhaal' },
        { id: 36, naam: 'Sinterklaas- en Kerstverhaal' },
        { id: 37, naam: 'Sprookje' },
        { id: 38, naam: 'Stripverhaal' },
        { id: 39, naam: 'Tijdschrift' },
    ]);
  },
};
