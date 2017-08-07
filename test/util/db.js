import knex from 'knex';

const config = require('../../server/config').default;

const dbConfig = {
  client: 'mssql',
  connection: {
    server: config.dbTestUser.server,
    user: config.dbTestUser.user,
    password: config.dbTestUser.password,
    database: config.dbTestUser.name,
    options: {
      encrypt: true,
    },
  },
  acquireConnectionTimeout: 5000,
};

const db = knex(dbConfig);

export default db;
