import bunyan from 'bunyan';

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

export default logger;
export {
  viperRestServiceLogger,
  prisonerAssessmentsServiceLogger,
  databaseLogger,
};

