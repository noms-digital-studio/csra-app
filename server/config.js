/**
 * Central place for accessing application config from the environment
 */

// Load any extra environment variables from .env
require('dotenv').config();

export default {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || '5000',
  appinsightsKey: process.env.APPINSIGHTS_INSTRUMENTATIONKEY || '',
};
