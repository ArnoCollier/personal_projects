const { tables, getKnex } = require('../data/index'); // 👈 1

const SELECT_COLUMNS = [
  `${tables.reservatie}.id`,
  `${tables.reservatie}.begindatum`,
  `${tables.reservatie}.einddatum`,
  `${tables.reservatie}.user_id`,
  `${tables.reservatie}.boek_id`,

];

const findAll = async (userId) => {
  return await getKnex()(tables.reservatie)
    .join(tables.user, `${tables.user}.id`, '=', `${tables.reservatie}.user_id`)
    .select(SELECT_COLUMNS)
    .where(`${tables.user}.id`, userId)
    .orderBy('begindatum', 'ASC');
};

const findById = async (id) => {
  const reservatie = await getKnex()(tables.reservatie)
    .select(SELECT_COLUMNS)
    .where(`${tables.reservatie}.id`, id);
  return reservatie[0];
};

const create = async (reservatie) => {
  await getKnex()(tables.reservatie).insert(reservatie);
  return await findById(reservatie.id);
};

const updateById = async ({ id, begindatum, einddatum, }) => {
  await getKnex()(tables.reservatie).where({ id }).update({
    begindatum,
    einddatum,    
  });

  const r = await findById(id);
  return r;
};

const deleteById = async (id, user_id) => {
  return await getKnex()(tables.reservatie)
    .where({ id })
    .where({ user_id })
    .delete();
};

// 👇 3
module.exports = {
  findAll,
  findById,
  create,
  updateById,
  deleteById,
};
