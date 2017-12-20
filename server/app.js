/* eslint-disable max-len */
const path = require('path');
const express = require('express');
const { json } = require('body-parser');
const helmet = require('helmet');
const hsts = require('hsts');
const bunyanMiddleware = require('bunyan-middleware');
const session = require('cookie-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const flash = require('connect-flash');

const config = require('./config');
const { logger } = require('./services/logger');
const authentication = require('./authentication');

const createHealthRoute = require('./routes/health');
const createViperRoute = require('./routes/viper');
const createPrisonerAssessmentsRoute = require('./routes/assessments');
const createSignInRoute = require('./routes/signIn');
const createSignOutRoute = require('./routes/signOut');
const createSearchPrisonerRoute = require('./routes/searchPrisoner');

const index = require('./routes/index');
const { authenticationMiddleware } = require('./authentication');

module.exports = function createApp({ db, appInfo, viperService, prisonerAssessmentsService, signInService, searchPrisonerService }) {
  const app = express();
  const sixtyDaysInSeconds = 5184000;
  const sessionConfig = {
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 60000,
    },
  };

  app.set('trust proxy', 1); // trust first proxy

  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'pug');

  app.use(helmet());
  app.use(hsts({
    maxAge: sixtyDaysInSeconds,
    includeSubDomains: true,
    preload: true,
  }));

  authentication.init(signInService);

  app.use(cookieParser());
  app.use(json());

  if (process.env.NODE_ENV === 'production') {
    sessionConfig.cookie.secure = true; // serve secure cookies
  }

  // set locals
  app.use((req, res, next) => {
    res.locals.appinsightsKey = config.appinsightsKey;
    next();
  });

  app.use(session(sessionConfig));

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(flash());

  app.use(bunyanMiddleware({ logger }));

  app.use(express.static(path.join(__dirname, '..', 'public')));

  app.use('/api/assessments', createPrisonerAssessmentsRoute(prisonerAssessmentsService, authenticationMiddleware));
  app.use('/api/viper', createViperRoute(viperService, authenticationMiddleware));
  app.use('/api/search-prisoner', createSearchPrisonerRoute(searchPrisonerService, authenticationMiddleware));
  app.use('/health', createHealthRoute(db, appInfo));
  app.use('/signin', createSignInRoute(passport));
  app.use('/signout', createSignOutRoute());

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
