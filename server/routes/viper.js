import express from 'express';

export default function createRouter(viperService) {
  const router = express.Router();

  router.get('/:nomisId', async (req, res) => {
    const nomisId = req.params.nomisId;
    try {
      const viperRating = await viperService.rating(nomisId);
      const payload = { nomisId, viperRating };
      res.status(200);
      res.json(payload);
    } catch (exception) {
      res.status(404);
      res.json({ messasge: `Error retrieving viper rating for nomisId: ${nomisId}. The cause was: ${exception}` });
    }
  });

  return router;
}
