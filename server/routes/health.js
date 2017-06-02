import express from 'express';

export default function createRouter(db, appInfo) {
  const router = express.Router();

  router.get('/', (req, res) => {
    const result = {
      status: 'OK',
      ...appInfo.getBuildInfo(),
      checks: {},
    };

    const checks = {
      db: db.select(db.raw('1')),
    };

    function handleCheck(checkName) {
      return checks[checkName]
        .then(
          () => {
            result.checks[checkName] = 'OK';
          },
          (err) => {
            result.status = 'ERROR';
            result.checks[checkName] = err.message;
          },
        );
    }

    Promise
      .all(Object.keys(checks).map(handleCheck))
      .then(() => {
        res.status(result.status === 'OK' ? 200 : 500);
        res.json(result);
      });
  });

  return router;
}
