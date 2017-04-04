import path from 'path';
import express from 'express';

import healthRoute from './routes/health';

import { HEALTH_ENDPOINT } from './constants/routes';

const app = express();

app.use('/', express.static(path.join(__dirname, '..', 'public')));
app.use(HEALTH_ENDPOINT, healthRoute);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const error = new Error('Resource not found');
  error.status = 404;
  next(error);
});

// error handler
app.use((error, req, res, next) => {
  const errorMessage = error.message || 'error';
  const errorStatus = error.status || 500;

  res.status(errorStatus);
  res.send(errorMessage);
});

export default app;
