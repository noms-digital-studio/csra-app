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

export default logger;
