import express from 'express';

const router = express.Router();

router.get('/:nomisId', (req, res) => {
  // eslint-disable-next-line
  const viperScores = require('../../client/javascript/fixtures/viper.json').output;
  const nomisId = req.params.nomisId;
  const viperScore = viperScores.find(item => item.nomisId === nomisId);

  if (viperScore) {
    res.status(200).json(viperScore);
  } else {
    res.status(404).json({ error: 'Resource not found' });
  }
});


export default router;
