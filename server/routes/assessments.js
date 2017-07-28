import express from 'express';
import log from '../services/logger';

function handleGetAssessmentErrors(err, res) {
  log.error(err);
  if (err.type === 'not-found') {
    res.status(404);
    res.json({
      status: 'NOT FOUND',
      message: err.message,
    });
  }
  res.status(500);
  res.json({
    status: 'ERROR',
    message: err.message,
  });
}

function handlePostAssessmentErrors(err, res) {
  log.error(err);
  if (err.type === 'validation') {
    res.status(400);
    res.json({
      status: 'VALIDATION ERROR',
      message: err.message,
    });
  } else if (err.type === 'not-found') {
    res.status(404);
    res.json({
      status: 'NOT FOUND',
      message: err.message,
    });
  }
  res.status(500);
  res.json({
    status: 'ERROR',
    message: err.message,
  });
}

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

  router.put('/:id/risk', (req, res) => {
    const id = req.params.id;
    prisonerAssessmentsService.saveRiskAssessment(id, req.body)
    .then(() => {
      res.status(200);
      res.json();
    }).catch((err) => {
      handlePostAssessmentErrors(err, res);
    });
  });

  router.get('/:id/risk', (req, res) => {
    const id = req.params.id;

    prisonerAssessmentsService.riskAssessmentFor(id)
    .then((result) => {
      res.status(200);
      res.json(result);
    }).catch((err) => {
      handleGetAssessmentErrors(err, res);
    });
  });

  router.put('/:id/health', (req, res) => {
    const id = req.params.id;
    prisonerAssessmentsService.saveHealthAssessment(id, req.body)
    .then(() => {
      res.status(200);
      res.json();
    }).catch((err) => {
      handlePostAssessmentErrors(err, res);
    });
  });

  router.get('/:id/health', (req, res) => {
    const id = req.params.id;

    prisonerAssessmentsService.healthAssessmentFor(id)
    .then((result) => {
      res.status(200);
      res.json(result);
    }).catch((err) => {
      handleGetAssessmentErrors(err, res);
    });
  });

  return router;
}
