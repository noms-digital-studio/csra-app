/* eslint-disable max-len */
const path = require('path');
const express = require('express');
const { json } = require('body-parser');
const helmet = require('helmet');
const hsts = require('hsts');
const bunyanMiddleware = require('bunyan-middleware');
const session = require('express-session');


const { logger } = require('./services/logger');
const createHealthRoute = require('./routes/health');
const createViperRoute = require('./routes/viper');
const createPrisonerAssessmentsRoute = require('./routes/assessments');
const createSignInRoute = require('./routes/signIn');
const index = require('./routes/index');

module.exports = function createApp({ db, appInfo, viperService, prisonerAssessmentsService, signInService }) {
  const app = express();
  const sixtyDaysInSeconds = 5184000;

  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'pug');

  app.use(helmet());
  app.use(hsts({
    maxAge: sixtyDaysInSeconds,
    includeSubDomains: true,
    preload: true,
  }));

  app.use(session({
    secret: 'PUT ME IN AN ENVIRONMENT VARIABLE',
    resave: false,
    saveUninitialized: true,
  }));
  app.use(express.cookieParser());
  app.use(json());

  app.use(bunyanMiddleware({ logger }));

  app.use(express.static(path.join(__dirname, '..', 'public')));

  app.use('/health', createHealthRoute(db, appInfo));
  app.use('/api/viper', createViperRoute(viperService));
  app.use('/api/assessments', createPrisonerAssessmentsRoute(prisonerAssessmentsService));
  app.use('/signin', createSignInRoute(signInService));
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
};
