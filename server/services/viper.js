import superagent from 'superagent';
import url from 'url';

import config from '../config';
import { databaseLogger, viperRestServiceLogger as log } from './logger';

function viperRatingFromDatabase(db, nomisId) {
  log.info(`Getting Viper rating from the database for nomisID: ${nomisId}`);
  return db
    .select()
    .table('viper')
    .where('nomis_id', nomisId)
    .then((result) => {
      if (result[0]) {
        databaseLogger.info(`Viper rating found in database for nomisId: ${nomisId}`);
        return result[0].rating;
      }

      databaseLogger.info(`Viper rating NOT found in database for nomisID: ${nomisId}`);
      return null;
    });
}

function viperRatingFromApi(nomisId) {
  log.info(`Getting viper rating from the REST API for nomisID: ${nomisId}`);
  return new Promise((resolve, reject) => {
    superagent
      .get(url.resolve(`${config.viperRestServiceHost}`, `/analytics/viper/${nomisId}`))
      .set('API-key', config.viperRestServiceAuthenticationKey)
      .timeout({
        response: config.viperRestServiceConnectionTimeout,
        deadline: config.viperRestServiceReadTimeout,
      })
      .end((error, res) => {
        try {
          if (error) {
            log.info(`Viper rating NOT found from API for nomisID: ${nomisId}`);
            log.warn(error);
            resolve(null);
          }

          const bodyText = res.text;
          const body = res.body;
          if (body.nomsId && body.viperRating) {
            log.info(`Viper rating found from API for nomisId: ${nomisId}`);
            resolve(body.viperRating);
          }

          reject(`Invalid body: ${bodyText}`);
        } catch (exception) {
          log.error(exception);
          reject(exception);
        }
      });
  });
}

function ratingFor(db, nomisId) {
  if (process.env.USE_VIPER_SERVICE === 'true') {
    return viperRatingFromApi(nomisId);
  }

  return viperRatingFromDatabase(db, nomisId);
}

export default function createViperService(db) {
  return { rating: nomisId => ratingFor(db, nomisId) };
}
