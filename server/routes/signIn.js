const express = require('express');

module.exports = function createRouter(signInService) {
  const router = express.Router();

  router.post('/', (req, res) => {
    signInService.signin(req.body).then(() => {
      res.status(200);
      res.end();
    });
  });

  return router;
};
