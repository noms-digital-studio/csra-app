const express = require('express');
const bodyParser = require('body-parser');

module.exports = function createRouter(signInService) {
  const router = express.Router();

  router.get('/', (req, res) => {
    res.render('signin');
  });

  router.use(bodyParser.urlencoded({ extended: true }));

  router.post('/', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    signInService.signIn(username, password)
    .then((userdetails) => {
      res.status(200);
      req.session.user = userdetails;
      res.redirect('/');
      // res.json(userdetails);
      // res.end();
    });
  });

  return router;
};
