const express = require('express');
const superagent = require('superagent');
const url = require('url');
const config = require('../config');
const { generateApiGatewayToken } = require('../jwtUtils');
const { logger: log } = require('../services/logger');

module.exports = function createRouter(db, appInfo) {
  const router = express.Router();

  function dbCheck() {
    return db.select(db.raw('1'))
      .then(() => ({ name: 'db', status: 'OK', message: 'OK' }))
      .catch(err => ({ name: 'db', status: 'ERROR', message: err.message }));
  }

  function viperRestServiceCheck() {
    return new Promise((resolve, reject) => {
      superagent
        .get(url.resolve(`${config.viper.url}`, '/analytics/health'))
        .set('API-key', config.viper.apiKey)
        .timeout({
          response: 2000,
          deadline: 2500,
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

  function elite2RestServiceCheck() {
    return new Promise((resolve, reject) => {
      superagent.get(url.resolve(`${config.elite2.url}`, 'info/health'))
      .set('Authorization', `Bearer ${generateApiGatewayToken()}`)
      .set('Accept', 'application/json')
      .timeout({
        response: 2000,
        deadline: 2500,
      })
      .end((error, result) => {
        try {
          if (error) {
            log.error(error, 'Error calling elite 2 REST service health endpoint');
            resolve({ name: 'elite2RestService', status: 'ERROR', message: 'ERROR' });
          }

          if ((result.status === 200) && (result.body.status === 'UP')) {
            resolve({ name: 'elite2RestService', status: 'OK', message: 'OK' });
          }

          reject({ name: 'elite2RestService', status: 'ERROR', message: `Status: ${result.error}` });
        } catch (exception) {
          log.error(exception, 'Error calling elite 2 REST service health endpoint');
          reject(exception);
        }
      });
    });
  }

  function gatherCheckInfo(total, currentValue) {
    return { ...total, [currentValue.name]: currentValue.message };
  }

  router.get('/', (req, res) => {
    const checks = [dbCheck, viperRestServiceCheck, elite2RestServiceCheck];

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
};
