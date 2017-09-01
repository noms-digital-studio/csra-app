/**
 * This file is automatically loaded when knex runs migrations
 */

const config = require('./server/config');

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
