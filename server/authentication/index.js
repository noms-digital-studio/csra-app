const passport = require('passport');

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

passport.serializeUser(({ forename, surname, username, email }, done) => done(null, {
  forename,
  surname,
  username,
  email,
}));

passport.deserializeUser((userDetails, done) => {
  done(null, {
    forename: userDetails.forename,
    surname: userDetails.surname,
    username: userDetails.username,
    email: userDetails.email,
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
      .then(user => done(null, user))
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
