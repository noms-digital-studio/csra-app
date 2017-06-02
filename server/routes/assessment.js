import express from 'express';

export default function createRouter(assessment) {
  const router = express.Router();

  router.post('/', (req, res) => {
    assessment.record(req.body)
      .then(
        result => res.json({
          status: 'OK',
          data: { id: result.assessment_id },
        }),
        (err) => {
          // eslint-disable-next-line no-console
          console.warn('Failed to save assessment', err.stack);
          res.status(500);
          res.json({
            status: 'ERROR',
            error: err.message,
          });
        },
      );
  });

  return router;
}
