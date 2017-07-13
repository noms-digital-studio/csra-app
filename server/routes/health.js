import express from 'express';
import superagent from 'superagent';
import url from 'url';
import config from '../config';
import log from '../services/logger';

export default function createRouter(db, appInfo) {
  const router = express.Router();

  function dbCheck() {
    return db.select(db.raw('1'))
      .then(() => ({ name: 'db', status: 'OK', message: 'OK' }))
      .catch(err => ({ name: 'db', status: 'ERROR', message: err.message }));
  }

  function viperRestServiceCheck() {
    return new Promise((resolve, reject) => {
      if (process.env.USE_VIPER_SERVICE === 'false') {
        resolve({ name: 'viperRestService', status: 'OK', message: 'Not enabled' });
        return;
      }

      superagent
        .get(url.resolve(`${config.viperRestServiceHost}`, '/analytics/health'))
        .set('API-key', config.viperRestServiceAuthenticationKey)
        .timeout({
          response: config.viperRestServiceConnectionTimeout,
          deadline: config.viperRestServiceReadTimeout,
        })
        .end((error, result) => {
          try {
            if (error) {
              log.error(error, 'Error calling viper REST service health endpoint');
              resolve({ name: 'viperRestService', status: 'ERROR', message: 'ERROR' });
            }

            if ((result.status === 200) && (result.body.healthy === true)) {
              resolve({ name: 'viperRestService', status: 'OK', message: 'OK' });
            }

            reject({ name: 'viperRestService', status: 'ERROR', message: `Status: ${result.error}` });
          } catch (exception) {
            log.error(exception, 'Error calling viper REST service health endpoint');
            reject(exception);
          }
        });
    });
  }

  function gatherCheckInfo(total, currentValue) {
    return { ...total, [currentValue.name]: currentValue.message };
  }

  router.get('/', (req, res) => {
    const checks = [dbCheck, viperRestServiceCheck];

    Promise
      .all(checks.map(fn => fn()))
      .then((checkResults) => {
        const allOk = checkResults.every(item => item.status === 'OK');
        const result = {
          status: allOk ? 'OK' : 'ERROR',
          ...appInfo.getBuildInfo(),
          checks: checkResults.reduce(gatherCheckInfo, {}),
        };
        res.status(allOk ? 200 : 500);
        res.json(result);
      });
  });

  return router;
}
