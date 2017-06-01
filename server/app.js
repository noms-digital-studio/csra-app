import path from 'path';
import express from 'express';

import createHealthRoute from './routes/health';
import index from './routes/index';

import { HEALTH_ENDPOINT } from './constants/routes';

export default function createApp(db, appInfo) {
  const app = express();

  app.use(express.static(path.join(__dirname, '..', 'public')));

  app.use(HEALTH_ENDPOINT, createHealthRoute(db, appInfo));
  app.use('/', index);

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
