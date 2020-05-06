const config = require('../config');

const env = process.env.NODE_ENV || 'development';
console.log('config.db', config.db)
module.exports = {
  [env]: config.db
};
