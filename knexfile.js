/**
 * This file is automatically loaded when knex runs migrations
 */

require('babel-register')();

const config = require('./server/config').default;

module.exports = {
  client: 'mssql',
  connection: {
    server: config.db.server,
    user: config.db.user,
    password: config.db.password,
    database: config.db.name,
    options: {
      encrypt: true,
    },
  },
  acquireConnectionTimeout: 5000,
};
