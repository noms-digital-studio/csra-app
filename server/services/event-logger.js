let trackEvent;

// App insights blows up in a non server environment
try {
  // eslint-disable-next-line
  const appInsights = require('../../utils/applicationinsights');
  trackEvent = (name, properties = {}) => {
    appInsights.client.trackEvent({
      name,
      properties,
    });
  };
} catch (exception) {
  // eslint-disable-next-line
  const { logger } = require('./logger');
  trackEvent = (name, properties = {}) => {
    logger.info(`Event ${name},  ${JSON.stringify(properties)}`);
  };
}


module.exports = trackEvent;
