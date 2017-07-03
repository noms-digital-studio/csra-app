/* eslint-disable no-console */
import superagent from 'superagent';

function viperRatingFromDatabase(db, nomisId) {
  console.log('Getting viper rating from the database for nomisID: ', nomisId);
  return db
    .select()
    .table('viper')
    .where('nomis_id', nomisId)
    .then((result) => {
      if (result[0]) {
        return result[0].rating;
      }

      console.log('viper rating not found for nomisID: ', nomisId);
      return null;
    });
}

function viperRatingFromApi(nomisId) {
  console.log('Getting viper rating from the REST API for nomisID: ', nomisId);
  superagent
    .get(`http://localhost:9090/offender/${nomisId}/viper`)
    .set('Ocp-Apim-Subscription-Key', 'valid-subscription-key')
    .end((error, res) => {
      if (error) {
        console.log('viper rating not found for nomisID: ', nomisId);
        console.log('error: ', error);
        return null;
      }

      console.log('viper rating found for nomisId: ', nomisId);
      return res.body.viperRating;
    });
}

function ratingFor(db, nomisId) {
  if (process.env.USE_VIPER_REST_API) {
    return viperRatingFromApi(nomisId);
  }

  return viperRatingFromDatabase(db, nomisId);
}

export default function createViperService(db) {
  return { rating: nomisId => ratingFor(db, nomisId) };
}
