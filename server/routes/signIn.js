const express = require('express');

module.exports = function createRouter(signInService) {
  const router = express.Router();

  router.post('/', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    signInService.signIn(username, password)
    .then((userdetails) => {
      res.status(200);
      res.json(userdetails);
      res.end();
    });
  });

  return router;
};
