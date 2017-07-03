/* eslint-disable no-console */
import request from 'supertest';
import uuid from 'uuid/v4';
import db from '../../util/db';
import superagent from 'superagent';

const baseUrl = process.env.APP_BASE_URL;

function primeDatabase(nomisId) {
  return db.insert({
    nomis_id: nomisId,
    rating: 0.42,
  })
    .into('viper')
    .then((error, result) => {
      if (error) {
        console.log('error: ', error);
        throw new Error(error);
      }

      return result;
    });
}

function primeMock(nomisId) {
  return new Promise((resolve, reject) => {
    superagent
      .post('http://localhost:9090/__admin/mappings')
      .send({
        request: {
          method: 'GET',
          urlPattern: `/offender/${nomisId}/viper`,
          headers: {
            'Ocp-Apim-Subscription-Key': {
              equalTo: 'valid-subscription-key',
            },
          },
        },
        response: {
          status: 200,
          body: `{"nomsId": "${nomisId}", "viperRating": 0.42}`,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      })
      .end((error) => {
        if (error) {
          console.log('error: ', error);
          reject(error);
        }

        resolve();
      });
  });
}

describe('/api/viper/:nomisId', () => {
  const nomisId = uuid().substring(0, 8);

  before(function (done) {
    this.timeout(5000);
    if (process.env.USE_VIPER_REST_API === 'false') {
      primeDatabase(nomisId)
        .then(done)
        .catch(done);
    } else {
      primeMock(nomisId)
        .then(done)
        .catch(done);
    }
  });

  it('returns a viper rating for a known nomis id', function test(done) {
    this.timeout(5000);
    request(baseUrl).get(`/api/viper/${nomisId}`)
      .expect(200)
      .end((err, res) => {
        if (err) done(err);
        expect(res.body).to.eql({ nomisId, viperRating: 0.42 });
        done();
      });
  });

  it('returns a 404 (not found) for an unknown nomis id', function test(done) {
    this.timeout(5000);
    const unknownNomisId = uuid().substring(0, 8);
    request(baseUrl).get(`/api/viper/${unknownNomisId}`)
      .expect(404)
      .end((err, res) => {
        if (err) done(err);
        expect(res.body).to.eql({ messasge: `Error retrieving viper rating for nomisId: ${unknownNomisId}. The cause was: Not found` });
        done();
      });
  });
});

