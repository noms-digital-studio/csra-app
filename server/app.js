import path from 'path';
import express from 'express';
import morgan from 'morgan';
import { json } from 'body-parser';

import config from './config';

import createHealthRoute from './routes/health';
import createAssessmentRoute from './routes/assessment';
import indexRoute from './routes/index';
import viperRoute from './routes/viper';

export default function createApp(db, appInfo, assessmentService) {
  const app = express();

  app.use(json());

  app.use(morgan(config.dev ? 'dev' : 'short'));

  app.use(express.static(path.join(__dirname, '..', 'public')));

  app.use('/health', createHealthRoute(db, appInfo));
  app.use('/api/assessment', createAssessmentRoute(assessmentService));
  app.use('/api/viper', viperRoute);
  app.use('/', indexRoute);

  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    const error = new Error('Resource not found');
    error.status = 404;
    next(error);
  });

  // error handler
  // eslint-disable-next-line no-unused-vars
  app.use((error, req, res, next) => {
    const errorMessage = error.message || 'error';
    const errorStatus = error.status || 500;

    res.status(errorStatus);
    res.send(errorMessage);
  });

  return app;
}
