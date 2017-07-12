import express from 'express';
import { databaseLogger as log } from '../services/logger';

export default function createRouter(assessment) {
  const router = express.Router();

  router.post('/', (req, res) => {
    assessment.record(req.body)
      .then(
        result => res.json({
          status: 'OK',
          data: { id: result.assessment_id },
        }),
      ).catch(
      (err) => {
        res.status(500);
        const response = {
          status: 'ERROR',
          error: {
            code: 'unknown',
            message: err.message,
          },
        };

        if (err.type === 'validation') {
          res.status(400);
          response.error.code = 'validation';
        } else {
          log.error(err);
        }

        res.json(response);
      },
    );
  });

  return router;
}
