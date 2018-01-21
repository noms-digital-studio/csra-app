/**
 * Central place for accessing application config from the environment
 */
require('dotenv').config();

const url = require('url');

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
  appinsightsKey: process.env.APPINSIGHTS_INSTRUMENTATIONKEY || 'your-secret-key',
  sessionSecret: process.env.SESSION_SECRET || 'your-secret-key',
  db: {},
  dbTestUser: {},
  viper: {
    url: null,
    apiKey: null,
  },
  elite2: {
    url: null,
    apiGatewayToken: null,
    apiGatewayPrivateKey: null,
  },
};

const dbUri = neededInProd('DB_URI');
if (dbUri) {
  const parsed = url.parse(dbUri);
  const auth = parsed.auth.split(':');
  const [user, password] = auth;
  config.db.server = parsed.hostname;
  config.db.user = user;
  config.db.password = password;
  config.db.name = parsed.pathname.slice(1);
}

const dbUriTests = process.env.DB_URI_TESTS;
if (dbUriTests) {
  const parsed = url.parse(dbUriTests);
  const auth = parsed.auth.split(':');
  const [user, password] = auth;
  config.dbTestUser.server = parsed.hostname;
  config.dbTestUser.user = user;
  config.dbTestUser.password = password;
  config.dbTestUser.name = parsed.pathname.slice(1);
}

config.viper.url = neededInProd('VIPER_SERVICE_URL');
config.viper.apiKey = neededInProd('VIPER_SERVICE_API_KEY');

config.elite2.url = neededInProd('ELITE2_URL');
config.elite2.apiGatewayToken = neededInProd('ELITE2_API_GATEWAY_TOKEN');
config.elite2.apiGatewayPrivateKey = Buffer.from(neededInProd('ELITE2_API_GATEWAY_PRIVATE_KEY'), 'base64').toString('ascii');
module.exports = config;
