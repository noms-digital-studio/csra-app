import express from 'express';
import log from '../services/logger';

function errorResponse(res, nomisId, cause) {
  res.status(404);
  res.json({ messasge: `Error retrieving viper rating for nomisId: ${nomisId}. The cause was: ${cause}` });
}

export default function createRouter(viperService) {
  const router = express.Router();

  router.get('/:nomisId', (req, res) => {
    const nomisId = req.params.nomisId;

    viperService.rating(nomisId)
      .then((viperRating) => {
        if (viperRating === null) {
          errorResponse(res, nomisId, 'Not found');
        } else {
          res.status(200);
          res.json({ nomisId, viperRating });
        }
      })
      .catch((error) => {
        log.error(error);
        errorResponse(res, nomisId, error);
      });
  });

  return router;
}
