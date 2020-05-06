const db = require('../models');

module.exports = {
  findAllUsers: async (options = {}) => db.user.findAll({
    attributes: {
      exclude: ['password', 'createdAt', 'updatedAt']
    },
    ...options
  }),
  findOrCreate: params => db.user.findOrCreate(params),
  findOneUser: (query = {}) => db.user.findOne({
    attributes: {
      exclude: ['password', 'createdAt', 'updatedAt']
    },
    ...query
  }),
};
