const { tables, getKnex } = require('../data/index');
const ServiceError = require('../core/serviceError');


const findAll = async () => {
    const auteurs = await getKnex()(tables.auteur).select();
    return auteurs;
    };
const findById = async (id) => {
    const auteur = (
        await getKnex()(tables.auteur)
            .select()
            .where(`${tables.auteur}.id`, id)
    )[0];

    if (!auteur) {
        throw ServiceError.notFound(`No author with id ${id} exists`, { id });
    }
    return auteur;
};
const create = async (auteur) => {
    try {
        const id = (
            await getKnex()(tables.auteur).insert({
                id: auteur.id,
                voornaam: auteur.voornaam,
                achternaam: auteur.achternaam,
                geboortedatum: auteur.geboortedatum,
            })
        )[0];
        return id;
    } catch (error) {
        getLogger().error('Error in create', { error });
        throw error;
    }
};
const updateById = async ({
    id,
    voornaam,
    achternaam,
    geboortedatum,
}) => {
    await getKnex()(tables.auteur).where({ id }).update({
        voornaam,
        achternaam,
        geboortedatum,
    });

    const a = await findById(id);
    return a;
};
const deleteById = async (id) => {
    return await getKnex()(tables.auteur)
        .where({ id })
        .delete();
};
module.exports = {
    findAll,
    findById,
    create,
    updateById,
    deleteById,
};

