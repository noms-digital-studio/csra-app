import knex from 'knex';

// Ensure we use same DB setup as migrations
import dbConfig from '../knexfile';

export default function createDBConnectionPool() {
  return knex(dbConfig);
}
