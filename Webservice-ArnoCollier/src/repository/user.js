const { getLogger } = require('../core/logging');
const { tables, getKnex } = require('../data/index'); // 👈 1

const SELECT_COLUMNS = [
  `${tables.user}.id`,
  `${tables.user}.username`,
  `${tables.user}.voornaam`,
  `${tables.user}.achternaam`,
  `${tables.user}.email`,
  `${tables.user}.geboortedatum`,
  `${tables.user}.roles`,
];

const findAll = async () => {
  return await getKnex()(tables.user)
    .select(SELECT_COLUMNS)
    .orderBy('achternaam', 'ASC');
};

const findById = async (id) => {
  return await getKnex()(tables.user)
    .select(SELECT_COLUMNS)
    .where(`${tables.user}.id`, id);
};

const findByUsername = async (username) => {
  return await getKnex()(tables.user)
    .select(SELECT_COLUMNS)
    .where(`${tables.user}.username`, username);
};
const findByUser = (username) => {
  return getKnex()(tables.user).where('username', username).first();
};

const create = async (user) => {
  try {
    const id = (
      await getKnex()(tables.user).insert({
        id: user.id,
        username: user.username,
        voornaam: user.voornaam,
        achternaam: user.achternaam,
        email: user.email,
        geboortedatum: user.geboortedatum,
        password_hash: user.password_hash,
        roles: JSON.stringify(user.roles),
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
  email,
  password_hash,
}) => {
  const user = {
    email,
    password_hash,
  };
  await getKnex()(tables.user).where({ id }).update(user);
  return id;
};

const deleteById = async (id) => {
  await getKnex()(tables.user).where({ id }).delete();
};

module.exports = {
  findAll,
  findById,
  findByUsername,
  findByUser,
  create,
  updateById,
  deleteById,
  findByUsername,
};
