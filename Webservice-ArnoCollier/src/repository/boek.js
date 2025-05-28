const { log } = require('winston');
const { tables, getKnex } = require('../data/index');
const ServiceError = require('../core/serviceError');
const boek = require('../rest/boek');

const SELECT_COLUMNS = [
    `${tables.boek}.id`,
    `${tables.boek}.titel`,
    `${tables.boek}.auteur_id`,
    `${tables.boek}.release_datum`,
    `${tables.boek}.isbn`,
    `${tables.boek}.taal`,
    `${tables.boek}.aantal_paginas`,
    `${tables.boek}.uitgever`,
    `${tables.boek}.genre_naam`,
];
const formatBoek = ({
    id,
    titel,
    auteur_id,
    release_datum,
    isbn,
    taal,
    aantal_paginas,
    uitgever,
    genre_naam,
  }) => ({
    id,
    titel,
    auteur_id,
    release_datum,
    isbn,
    taal,
    aantal_paginas,
    uitgever,
    genre_naam,
  });


const findAll = async () => {
    const boeken = await getKnex()(tables.boek)
      .join(tables.genre, `${tables.genre}.id`, '=', `${tables.boek}.genre_id`)
      .select(SELECT_COLUMNS);
  
    const formattedBoeken = boeken.map((boek) => formatBoek(boek));
    return formattedBoeken;
  };


const findById = async (id) => {
    const boek = (
      await getKnex()(tables.boek)
        .select()
        .where(`${tables.boek}.id`, id)
    )[0];

    if (!boek) {
      throw ServiceError.notFound(`No book with id ${id} exists`, { id });
    }
};

const create = async (nieuwBoek) => {
    const [boekId] = await getKnex(tables.boek).insert(nieuwBoek);
    return await getBoekById(boekId);
};

const getBoekById = async (boekId) => {
    return knex(tables.boek).where('id', boekId).first();
};

const updateBoek = async (boekId, boekData) => {
    return knex(tables.boek).where('id', boekId).update(boekData);
};

const deleteBoek = async (boekId) => {
    return knex(tables.boek).where('id', boekId).del();
};

const getAllBoeken = async () => {
    return await knex(tables.boek).select(SELECT_COLUMNS);
};

module.exports = {
    findAll,
    findById,
    create,
    getBoekById,
    updateBoek,
    deleteBoek,
    getAllBoeken,
};
