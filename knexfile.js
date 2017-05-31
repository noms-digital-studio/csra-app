/**
 * This file is automatically loaded when knex runs migrations
 */

require('babel-register')();

const config = require('./server/config').default;

module.exports = {
  client: 'mssql',
  connection: config.db,
};
