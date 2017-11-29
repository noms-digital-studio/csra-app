const passport = require('passport');
const trackEvent = require('../services/event-logger');
const { SIGN_IN } = require('../constants');

const LocalStrategy = require('passport-local').Strategy;

function authenticationMiddleware() {
  // eslint-disable-next-line
  return (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/signin');
  };
}

passport.serializeUser((user, done) => done(null, user));

passport.deserializeUser((userDetails, done) => {
  done(null, {
    forename: userDetails.forename,
    surname: userDetails.surname,
    username: userDetails.username,
    email: userDetails.email,
    authorities: userDetails.authorities,
    eliteAuthorisationToken: userDetails.eliteAuthorisationToken,
  });
});

function init(signInService) {
  const strategy = new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true,
  }, (req, username, password, done) => {
    signInService
      .signIn(username, password)
      .then((user) => {
        trackEvent(SIGN_IN, { username });
        return done(null, user);
      })
      .catch((error) => {
        switch (error.type) {
          case 'unauthorised':
            return done(null, false, req.flash('signInWarning', error.message));
          case 'server-error':
          case 'forbidden':
          default:
            return done(null, false, req.flash('signInError', error.message));
        }
      });
  });

  passport.use(strategy);
}

module.exports.init = init;
module.exports.authenticationMiddleware = authenticationMiddleware;
