import session from 'cookie-session';
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

export function authenticationMiddleware() {
  return (req, res, next) => {
    req.user = {
      forename: 'John',
      surname: 'Doe',
      eliteAuthorisationToken: 'xxx.yyy.zzz',
      username: 'username',
      email: 'email',
      authorities: [{ authority: 'ROLE_A' }, { authority: 'ROLE_B' }],
    };
    next();
  };
}

export default setupMockAuthentication;
