/**
 * Central place for accessing application config from the environment
 */

import url from 'url';

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
  appinsightsKey: process.env.APPINSIGHTS_INSTRUMENTATIONKEY || 'your-secret-key',
  db: {},
  viper: {
    enabled: false,
    url: null,
    apiKey: null,
  },
};

const dbUri = neededInProd('DB_URI');
if (dbUri) {
  const parsed = url.parse(dbUri);
  const auth = parsed.auth.split(':');
  config.db.server = parsed.hostname;
  config.db.user = auth[0];
  config.db.password = auth[1];
  config.db.name = parsed.pathname.slice(1);
}

if (process.env.USE_VIPER_SERVICE === 'true') {
  config.viper.enabled = true;
  config.viper.url = neededInProd('VIPER_SERVICE_URL');
  config.viper.apiKey = neededInProd('VIPER_SERVICE_API_KEY');
}


export default config;
