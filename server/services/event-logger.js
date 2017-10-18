const appInsights = require('../../utils/applicationinsights');

const trackEvent = (name, properties) => {
  appInsights.client.trackEvent({
    name,
    properties,
  });
};


module.exports = trackEvent;
