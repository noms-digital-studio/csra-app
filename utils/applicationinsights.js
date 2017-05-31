const appInsights = require('applicationinsights');
const config = require('../server/config');

appInsights.setup(config.appinsightsKey).start();

module.exports = appInsights;
