import knex from 'knex';
// Ensure we use same DB setup as migrations
import dbConfig from '../../knexfile';

const db = knex(dbConfig);

export default db;
