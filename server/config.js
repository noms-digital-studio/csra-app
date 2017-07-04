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

const viperServiceHost = neededInProd('VIPER_SERVICE_HOST');
if (viperServiceHost) {
  config.viperServiceHost = viperServiceHost;
}

const viperServiceAuthenticationKey = neededInProd('VIPER_SERVICE_AUTHENTICATION_KEY');
if (viperServiceAuthenticationKey) {
  config.viperServiceAuthenticationKey = viperServiceAuthenticationKey;
}

const viperServiceAuthenticationValue = neededInProd('VIPER_SERVICE_AUTHENTICATION_VALUE');
if (viperServiceAuthenticationValue) {
  config.viperServiceAuthenticationValue = viperServiceAuthenticationValue;
}

export default config;
