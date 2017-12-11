const express = require('express');
const bodyParser = require('body-parser');

module.exports = function createRouter(searchPrisonerService, authenticationMiddleware) {
  const router = express.Router();

  router.use(bodyParser.urlencoded({ extended: true }));
  router.use(authenticationMiddleware());

  router.get('/', async (req, res) => {
    const authToken = req.user.eliteAuthorisationToken;
    const service = searchPrisonerService(authToken);

    try {
      const offenders = await service.findPrisonersMatching(req.query.query);

      res.json(offenders);
    } catch (exception) {
      res.json([]);
    }
  });

  return router;
};
