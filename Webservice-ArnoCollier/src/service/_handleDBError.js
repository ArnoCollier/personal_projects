const ServiceError = require('../core/serviceError'); // 👈 2

// 👇 1
const handleDBError = (error) => {
  const { code = '', sqlMessage } = error; // 👈 3

  // 👇 4
  if (code === 'ER_DUP_ENTRY') {
    switch (true) {
      case sqlMessage.includes('idx_user_email_unique'):
        return ServiceError.validationFailed(
          'There is already a user with this email address'
        );
      case sqlMessage.includes('idx_reservatie_begindatum_unique'):
        return ServiceError.validationFailed(
          'There is already a reservation on this datum'
        );
      case sqlMessage.includes('idx_reservatie_einddatum_unique'):
        return ServiceError.validationFailed(
          'There is already a reservation on this datum'
        );
      case sqlMessage.includes('idx_boek_isbn_unique'):
        return ServiceError.validationFailed(
          'There is already a book with this ISBN'
        );
      default:
        return ServiceError.validationFailed('This item already exists');
    }
  }

  // 👇 4
  if (code.startsWith('ER_NO_REFERENCED_ROW')) {
    switch (true) {
      case sqlMessage.includes('fk_user_reservatie'):
        return ServiceError.notFound('This user does not exist');
      case sqlMessage.includes('fk_boek_reservatie'):
        return ServiceError.notFound('This book does not exist');
      case sqlMessage.includes('fk_reservatie_betaling'):
        return ServiceError.notFound('This reservation does not exist');
    }
  }

  // Return error because we don't know what happened
  return error;
};

module.exports = handleDBError; // 👈 1
