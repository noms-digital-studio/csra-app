import express from 'express';

export default function createRouter(assessment) {
  const router = express.Router();

  router.post('/', (req, res) => {
    assessment.record(req.body).then(
      result => res.json({
        status: 'OK',
        data: { id: result.assessment_id },
      }),
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
          // eslint-disable-next-line no-console
          console.warn('Unexpected error when saving assessment', err.stack);
        }

        res.json(response);
      },
    );
  });

  return router;
}
