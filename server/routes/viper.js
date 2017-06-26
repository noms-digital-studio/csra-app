import express from 'express';

function errorResponse(res, nomisId, cause) {
  res.status(404);
  res.json({ messasge: `Error retrieving viper rating for nomisId: ${nomisId}. The cause was: ${cause}` });
}

export default function createRouter(viperService) {
  const router = express.Router();

  router.get('/:nomisId', async (req, res) => {
    const nomisId = req.params.nomisId;
    try {
      const viperRating = await viperService.rating(nomisId);
      if (viperRating === null) {
        return errorResponse(res, nomisId, 'Not found');
      }

      res.status(200);
      res.json({ nomisId, viperRating });
      return res;
    } catch (exception) {
      return errorResponse(res, nomisId, exception);
    }
  });

  return router;
}
