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

const config = {
  dev: !production,
  port: process.env.PORT || '5000',
  appinsightsKey: process.env.APPINSIGHTS_INSTRUMENTATIONKEY || '',

  db: {},
};

const url = require('url');

const dbUri = neededInProd('DB_URI');
if (dbUri) {
  const parsed = url.parse(dbUri);
  const auth = parsed.auth.split(':');
  config.db.server = parsed.hostname;
  config.db.user = auth[0];
  config.db.password = auth[1];
  config.db.name = parsed.pathname.slice(1);
}

const viperRestServiceHost = neededInProd('VIPER_SERVICE_URL');
if (viperRestServiceHost) {
  config.viperRestServiceHost = viperRestServiceHost;
  config.viperRestServiceConnectionTimeout = process.env.VIPER_SERVICE_CONNECTION_TIMEOUT || 2000;
  config.viperRestServiceReadTimeout = process.env.VIPER_SERVICE_READ_TIMEOUT || 2000;
}

const viperRestServiceAuthenticationKey = neededInProd('VIPER_SERVICE_API_KEY');
if (viperRestServiceAuthenticationKey) {
  config.viperRestServiceAuthenticationKey = viperRestServiceAuthenticationKey;
}

export default config;
