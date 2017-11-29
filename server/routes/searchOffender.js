const express = require('express');
const bodyParser = require('body-parser');

module.exports = function createRouter(searchOffenderService, authenticationMiddleware) {
  const router = express.Router();

  router.use(bodyParser.urlencoded({ extended: true }));
  router.use(authenticationMiddleware());

  router.get('/', async (req, res) => {
    const authToken = req.user.eliteAuthorisationToken;
    const service = searchOffenderService(authToken);

    try {
      const offenders = await service.findOffendersMatching(req.query.query);

      res.json(offenders);
    } catch (exception) {
      res.json([]);
    }
  });

  return router;
};
