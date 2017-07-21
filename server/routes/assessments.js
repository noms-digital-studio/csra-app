import express from 'express';
import log from '../services/logger';

export default function createRouter(prisonerAssessmentsService) {
  const router = express.Router();

  router.post('/', (req, res) => {
    prisonerAssessmentsService.save(req.body)
      .then((result) => {
        res.status(201);
        res.json({
          id: result.id,
        });
      }).catch((err) => {
        log.error(err);
        if (err.type === 'validation') {
          res.status(400);
          res.json({
            status: 'VALIDATION ERROR',
            message: err.message,
          });
        }
        res.status(500);
        res.json({
          status: 'ERROR',
          message: err.message,
        });
      });
  });

  router.get('/', (req, res) => {
    prisonerAssessmentsService.list()
      .then((result) => {
        res.status(200);
        res.json(result);
      }).catch((err) => {
        log.error(err);
        res.status(500);
        res.json({
          status: 'ERROR',
          message: err.message,
        });
      });
  });

  return router;
}
