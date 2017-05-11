import path from 'path';
import express from 'express';

import healthRoute from './routes/health';
import index from './routes/index';

import { HEALTH_ENDPOINT } from './constants/routes';

const app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/', index);
app.use(HEALTH_ENDPOINT, healthRoute);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const error = new Error('Resource not found');
  error.status = 404;
  next(error);
});

// error handler
/* eslint-disable no-unused-vars */
app.use((error, req, res, next) => {
  const errorMessage = error.message || 'error';
  const errorStatus = error.status || 500;

  res.status(errorStatus);
  res.send(errorMessage);
});

export default app;
