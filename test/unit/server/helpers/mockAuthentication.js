import session from 'express-session';
import passport from 'passport';

import authentication from '../../../../server/authentication';

const setupMockAuthentication = (app, signInService) => {
  authentication.init(signInService);
  app.use(session({
    secret: 'test',
    resave: false,
    saveUninitialized: true,
  }));
  app.use(passport.initialize());
  app.use(passport.session());
};

export default setupMockAuthentication;
