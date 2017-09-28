const express = require('express');

module.exports = function createRouter(signInService) {
  const router = express.Router();

  router.post('/', (req, res) => {
    signInService.signin(req.body)
    .then((userdetails) => {
      res.status(200);
      res.json(userdetails);
      res.end();
    });
  });

  return router;
};
