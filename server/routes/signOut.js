const express = require('express');
const trackEvent = require('../services/event-logger');
const { SIGN_OUT } = require('../constants');

module.exports = function createRouter() {
  const router = express.Router();

  router.get('/', (req, res) => {
    trackEvent(SIGN_OUT, { username: req.user.username });
    req.logout();
    res.redirect('/signin');
  });

  return router;
};
