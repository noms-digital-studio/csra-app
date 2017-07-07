/* eslint-disable no-console */
import superagent from 'superagent';
import url from 'url';
import config from '../../server/config';

function viperRatingFromDatabase(db, nomisId) {
  console.log('Getting viper rating from the database for nomisID: ', nomisId);
  return db
    .select()
    .table('viper')
    .where('nomis_id', nomisId)
    .then((result) => {
      if (result[0]) {
        console.log('viper rating found in database for nomisId: ', nomisId);
        return result[0].rating;
      }

      console.log('viper rating NOT found in database for nomisID: ', nomisId);
      return null;
    });
}

function viperRatingFromApi(nomisId) {
  console.log('Getting viper rating from the REST API for nomisID: ', nomisId);
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
            console.log('Viper rating NOT found from API for nomisID: ', nomisId);
            console.log('error: ', error);
            resolve(null);
          }

          const bodyText = res.text;
          const body = res.body;
          if (body.nomsId && body.viperRating) {
            console.log('Viper rating found from API for nomisId: ', nomisId);
            resolve(body.viperRating);
          }

          reject(`Invalid body: ${bodyText}`);
        } catch (exception) {
          console.log('Error calling viper reset service health endpoint: ', exception);
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
