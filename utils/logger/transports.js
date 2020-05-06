const winston = require('winston');
const moment = require('moment');
const Transport = require('winston-transport');

const db = require('../../db/models');
const utils = require('../index');
const config = require('../../config');

const { format } = winston;
const { printf } = format;

/**
 * Transport for logger what writes to DB each critical error
 */
class DBTransport extends Transport {
  constructor(opts) {
    super(opts);
    this.level = opts.level;
  }

  log(info, callback) {
    db.error.create(info.message).then(() => callback());
  }
}

/**
 * Draw log in format depending on level
 */
const consoleFormats = printf((info) => {
  if (info.level === '[32minfo[39m') {
    return `>>> \u001b[32m${info.message.text}\u001b[39m`;
  }
  if (info.level === '[33mwarn[39m') {
    return `>>> \u001b[33m${info.message.text}\u001b[39m
    route: ${info.message.routeName}`;
  }
  return `>>> \u001b[31m${info.message.text}\u001b[39m
    route: ${info.message.routeName}
    (${moment().format('YYYY-MM-DD HH:mm:ss')})`;
});

module.exports = {
  DBTransport,
  consoleFormats
};
