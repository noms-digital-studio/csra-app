const bunyan = require('bunyan');

const logger = bunyan.createLogger({
  name: 'csra:server',
  streams: [
    {
      level: 'info',
      stream: process.stdout,
    },
  ],
  serializers: {
    req: bunyan.stdSerializers.req,
    err: bunyan.stdSerializers.err,
  },
});

const viperRestServiceLogger = logger.child({ service: 'viperRestService' });
const prisonerAssessmentsServiceLogger = logger.child({ service: 'prisonerAssessmentsServiceLogger' });
const databaseLogger = logger.child({ service: 'database' });


if (process.env.NODE_ENV === 'test') {
  const noop = () => {};
  const stubbedLogger = {
    info: noop,
    warn: noop,
    error: console.trace, // eslint-disable-line no-console
  };

  module.exports = {
    logger: stubbedLogger,
    viperRestServiceLogger: stubbedLogger,
    prisonerAssessmentsServiceLogger: stubbedLogger,
    databaseLogger: stubbedLogger,
  };
} else {
  module.exports = {
    logger,
    viperRestServiceLogger,
    prisonerAssessmentsServiceLogger,
    databaseLogger,
  };
}

