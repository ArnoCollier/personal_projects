const { errorMonitor } = require('koa');
const AuteurRepository = require('../repository/auteur');
const { getLogger } = require('../core/logging');
const ServiceError = require('../core/serviceError');
const handleDBError = require('./_handleDBerror');

const getAll = async () => {
    const auteurs = await AuteurRepository.findAll();
    return { auteurs, aantal: auteurs.length };
}

const getAuteur = async (id) => {
    const auteur = await AuteurRepository.findById(id);

    if (!auteur) {
        throw ServiceError.notFound(`No author with id ${id} exists`, { id });
    }

    return auteur;
}

const create = async ({
    voornaam,
    achternaam,
    geboortedatum,
    biografie 
}) => {
    const auteurs = (await getAll()).auteurs;
    let maxId;
    if (auteurs.length === 0) {
        maxId = 0;
    } else {
        maxId = Math.max(...auteurs.map(({ id }) => id));
    }

    const nieuweAuteur = {
        id: maxId + 1,
        voornaam,
        achternaam,
        geboortedatum,
        biografie,
        
    };

    try {
        const a = await AuteurRepository.create(nieuweAuteur);
        return a;
    } catch (error) {
        throw handleDBError(error);
    }
}

const updateAuteur = async (id, auteurData) => {
    return AuteurRepository.updateAuteur(id, auteurData);
};

const wijzig = async ({ auteur }) => {
    try {
        const b = await AuteurRepository.updateAuteur(auteur.id, auteur);
        return b;
    } catch (error) {
        throw handleDBError(error);
    }
};


const deleteAuteur = async (id) => {
    const auteur = await AuteurRepository.deleteAuteur(id);
    return auteur;
}

module.exports = {
    getAll,
    getAuteur,
    create,
    wijzig,
    updateAuteur,
    deleteAuteur,
};


