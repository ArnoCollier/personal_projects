const { errorMonitor } = require('koa');
const userRepository = require('../repository/user');
const ServiceError = require('../core/serviceError');
const handleDBError = require('./_handleDBerror');  
const { hashPassword, verifyPassword } = require('../core/password');
const Role = require('../core/roles');
const { generateJWT, verifyJWT } = require('../core/jwt');
const config = require('config');

const getAll = async () => {
  const users = await userRepository.findAll();
  return { users, aantal: users.length };
};

const getUser = async (id) => {
  const user = (await userRepository.findById(id))[0];

  if (!user) {
    throw ServiceError.notFound(`No user with id ${id} exists`, {
      id,
    });
  }

  return makeExposedUser(user);
};

const getUserByUsername = async (username) => {
  const user = (await userRepository.findByUsername(username))[0];

  if (!user) {
    throw ServiceError.notFound(`No user with username ${username} exists`, {
      username,
    });
  }

  return makeExposedUser(user);
};



const create = async ({
  username,
  voornaam,
  achternaam,
  email,
  geboortedatum,
  password,
}) => {
  const passwordHash = await hashPassword(password);

  const users = (await getAll()).users;
  let maxId;
  if (users.length === 0) {
    maxId = 0;
  } else {
    maxId = Math.max(...users.map(({ id }) => id));
  }

  const nieuweUser = {
    id: maxId + 1,
    username,
    voornaam,
    achternaam,
    email,
    geboortedatum,
    password_hash: passwordHash,
    roles: [Role.USER],
  };
  try {
    const uId = await userRepository.create(nieuweUser);
    const user = (await userRepository.findById(uId))[0];
    return await makeLoginData(user);
  } catch (error) {
    throw handleDBError(error);
  }
};

const wijzig = async ({
  id,
  username,
  voornaam,
  achternaam,
  email,
}) => {
  try {
    const uId = await userRepository.updateById({
      id,
      username,
      voornaam,
      achternaam,
      email,
      
    });
    return await getUser(uId);
  } catch (error) {
    throw handleDBError(error);
  }
};

const verwijder = async (id) => {
  await getUser(id);

  try {
    await userRepository.deleteById(id);
  } catch (error) {
    throw handleDBError(error);
  }
};

// 👇 8
const makeExposedUser = ({
  id,
  username,
  voornaam,
  achternaam,
  email,
  geboortedatum,
  roles,
}) => ({
  id,
  username,
  voornaam,
  achternaam,
  email,
  geboortedatum,
  roles,
});

const makeLoginData = async (user) => {
  const token = await generateJWT(user);
  return {
    user: makeExposedUser(user),
    token,
  };
};

const login = async (username, password) => {
  const user = await userRepository.findByUser(username);
  if (!user) {
    // DO NOT expose we don't know the user
    throw ServiceError.unauthorized(
      'The given username and password do not match'
    );
  }

  const passwordValid = await verifyPassword(password, user.password_hash);

  if (!passwordValid) {
    // DO NOT expose we know the user but an invalid password was given
    throw ServiceError.unauthorized(
      'The given username and password do not match'
    );
  }

  return await makeLoginData(user);
};


const checkAndParseSession = async (authHeader) => {
  if (!authHeader) {
    throw ServiceError.unauthorized('You need to be signed in');
  }

  if (!authHeader.startsWith('Bearer')) {
    throw ServiceError.unauthorized('Invalid authentication token');
  }

  const authToken = authHeader.substring(7);
  try {
    const { roles, userId } = await verifyJWT(authToken);

    return {
      userId,
      roles,
      authToken,
    };
  } catch (error) {
    getLogger().error(error.message, { error });
    throw new Error(error.message);
  }
};

const checkRole = (role, roles) => {
  const hasPermission = roles.includes(role);

  if (!hasPermission) {
    throw ServiceError.forbidden(
      'You are not allowed to view this part of the application'
    );
  }
};

module.exports = {
  getAll,
  getUser,
  getUserByUsername,
  create,
  wijzig,
  verwijder,
  login,
  checkAndParseSession,
  checkRole,
};
