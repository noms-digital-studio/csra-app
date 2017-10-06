const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');

module.exports = function createRouter() {
  const router = express.Router();

  router.get('/', (req, res) => {
    res.render('signin');
  });

  router.use(bodyParser.urlencoded({ extended: true }));

  router.post('/', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/signin',
  }));

  return router;
};
