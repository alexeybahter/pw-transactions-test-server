const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const _pick = require('lodash/pick');
const config = require('../config');

/**
 * create new token for user
 * @param user - user model instance
 */
exports.createTokensPair = (user, fields = ['id', 'role', 'username']) => {
  const data = _pick(user, fields);
  const result = {
    accessToken: jwt.sign(data, config.common.jwtSecret, {
      expiresIn: config.common.accessTokenExpiresIn
    }),
    refreshToken: jwt.sign(data, config.common.jwtSecret, {
      expiresIn: config.common.refreshTokenExpiresIn
    }),
    user: data
  };
  return result;
};

/**
 * compare passwords
 * @param rawPassword - password from form
 * @param hashedPassword - password from db.user
 */
exports.hash = {
  generate(password) {
    return crypto
      .createHmac(config.common.hashType, config.common.hashKey)
      .update(password)
      .digest('hex');
  },
  compare(rawPassword, hashedPassword) {
    return this.generate(rawPassword) === hashedPassword;
  }
};
