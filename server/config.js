/**
 * Central place for accessing application config from the environment
 */

// Load any extra environment variables from .env
require('dotenv').config();

const production = process.env.NODE_ENV === 'production';

function neededInProd(name) {
  if (name in process.env) {
    return process.env[name];
  }
  if (production) {
    throw new Error(`Missing env var ${name}`);
  }
  return null;
}

export default {
  dev: !production,
  port: process.env.PORT || '5000',
  appinsightsKey: process.env.APPINSIGHTS_INSTRUMENTATIONKEY || '',

  db: neededInProd('DB_URI'),
};
