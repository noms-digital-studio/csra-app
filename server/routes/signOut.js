const express = require('express');

module.exports = function createRouter() {
  const router = express.Router();

  router.get('/', (req, res) => {
    req.logout();
    res.redirect('/signin');
  });

  return router;
};
