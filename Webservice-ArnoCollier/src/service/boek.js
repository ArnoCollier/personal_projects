const { errorMonitor } = require('koa');
const AuteurRepository = require('../repository/auteur');
const boekRepository = require('../repository/boek');
const { getLogger } = require('../core/logging');
const ServiceError = require('../core/serviceError');
const handleDBError = require('./_handleDBerror');

const getAll = async () => {
    const boeken = await boekRepository.findAll();
    return { boeken, aantal: boeken.length };

};



const getAllBoekenAdmin = async () => {
  const boeken = await boekRepository.findAllAdmin();
  return { boeken, aantal: boeken.length };
};

const getAllBoekenUser = async (userId) => {
  const boeken = await boekRepository.findAll(userId);
  return { boeken, aantal: boeken.length };
};

const getBoek = async (id, userId) => {
  const boek = await boekRepository.findById(id);

  if (!boek || boek.auteur_id !== userId) {
    throw ServiceError.notFound(`No book with id ${id} exists`, { id });
  }

  return boek;
};

const getBoekById = async (boekId) => {
  const boek = await boekRepository.getBoekById(boekId);
  return boek;
};

const updateBoek = async (boekId, boekData) => {
  const boek = await boekRepository.updateBoek(boekId, boekData);
  return boek;
};

const deleteBoek = async (boekId) => {
  const boek = await boekRepository.deleteBoek(boekId);
  return boek;
};

const create = async ({
    titel,
    auteur_id,
    release_datum,
    isbn,
    taal,
    aantal_paginas,
    uitgever,
    genre,
}) => {
    const nieuwBoek = {
        titel,
        auteur_id,
        genre_id,
        release_datum,
        isbn,
        taal,
        aantal_paginas,
        uitgever,
    };
    
    try {
        const b = await boekRepository.create(nieuwBoek);
        return b;
    } catch (error) {
        throw handleDBError(error);
    }
};
const wijzig = async (boek) => {
    try {
        const b = await boekRepository.updateBoek(boek.id, boek);
        return b;
    } catch (error) {
        throw handleDBError(error);
    }
};


// in orde
const verwijder = async (id) => {
    await getBoek(id);
  
    try {
      await boekRepository.deleteById(id);
    } catch (error) {
      throw handleDBError(error);
    }
  };

module.exports = {
    getAll,
    getAllBoekenAdmin,
    getAllBoekenUser,
    getBoek,
    getBoekById,
    updateBoek,
    deleteBoek,
    create,
    wijzig,
    verwijder,
    };
