const appInsights = require('applicationinsights');

appInsights.setup().start();

module.exports = appInsights;
