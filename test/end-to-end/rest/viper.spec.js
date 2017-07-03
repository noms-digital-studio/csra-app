/* eslint-disable no-console */
import request from 'supertest';
import uuid from 'uuid/v4';
import db from '../../util/db';
import superagent from 'superagent';

const baseUrl = process.env.APP_BASE_URL;

describe('/api/viper/:nomisId', () => {
  it('returns a viper rating for a known nomis id', function test(done) {
    this.timeout(5000);
    const nomisId = uuid().substring(0, 8);
    db.insert({
      nomis_id: nomisId,
      rating: 0.42,
    })
      .into('viper')
      .then(
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
          .end((error, res) => {
            if (error) {
              console.log('error: ', error);
            }

            console.log('Wiremock primed with nomisId: ', nomisId);
          }),


        request(baseUrl).get(`/api/viper/${nomisId}`)
          .expect(200)
          .end((err, res) => {
            if (err) done(err);
            expect(res.body).to.eql({nomisId, viperRating: 0.42});
            done();
          }),
      )
    ;
  });

  it('returns a 404 (not found) for an unknown nomis id', function test(done) {
    this.timeout(5000);
    const nomisId = uuid().substring(0, 8);
    request(baseUrl).get(`/api/viper/${nomisId}`)
      .expect(404)
      .end((err, res) => {
        if (err) done(err);
        expect(res.body).to.eql({messasge: `Error retrieving viper rating for nomisId: ${nomisId}. The cause was: Not found`});
        done();
      });
  });
});

