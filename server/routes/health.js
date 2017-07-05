import express from 'express';

export default function createRouter(db, appInfo) {
  const router = express.Router();

  router.get('/', (req, res) => {
    function dbCheck() {
      return db.select(db.raw('1'))
        .then(() => ({ name: 'db', status: 'OK', message: 'OK' }))
        .catch(err => ({ name: 'db', status: 'ERROR', message: err.message }));
    }

    const checks = [dbCheck];

    function gatherCheckInfo(total, currentValue) {
      return { [currentValue.name]: currentValue.message };
    }

    Promise
      .all(checks.map(fn => fn()))
      .then((checkResults) => {
        const allOk = checkResults.every(item => item.status === 'OK');
        const checkData = checkResults.reduce(gatherCheckInfo, {});

        const result = {
          status: allOk ? 'OK' : 'ERROR',
          ...appInfo.getBuildInfo(),
          checks: checkData,
        };
        res.status(allOk ? 200 : 500);
        res.json(result);
      });
  });

  return router;
}
