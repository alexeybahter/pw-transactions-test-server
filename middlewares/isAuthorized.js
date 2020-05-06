const jwt = require('jsonwebtoken');
const db = require('../db/models');
const config = require('../config');

module.exports = async (req, res, next) => {
  try {
    if (req.method === 'OPTIONS') {
      return next();
    }

    if (!req.headers.authorization) {
      return res.status(401).json({
        errors: [
          {
            msg: 'Authorization header is empty!'
          }
        ]
      });
    }

    const token = req.headers.authorization.split('Bearer ')[1];
    const decoded = jwt.verify(token, config.common.jwtSecret);

    const user = await db.user.findOne({ where: { id: decoded.id } });

    if (!user) {
      return res.status(401).json({
        errors: [
          {
            msg: 'Token is broken'
          }
        ]
      });
    }

    req.user = user.toJSON();
    next();
  } catch (err) {
    return res.status(401).json({
      errors: [
        {
          msg: err.message
        }
      ]
    });
  }
};
