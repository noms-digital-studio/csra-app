/* eslint-disable no-console */
import superagent from 'superagent';
import request from 'supertest';
import uuid from 'uuid/v4';
import url from 'url';
import db from '../../util/db';
import config from '../../../server/config';

const baseUrl = process.env.APP_BASE_URL;

function primeDatabase(nomisId) {
  return db.insert({
    nomis_id: nomisId,
    rating: 0.42,
  })
    .into('viper');
}

function primeMock(mapping) {
  return superagent
    .post(url.resolve(`${config.viper.url}`, '/__admin/mappings'))
    .send(mapping);
}

function generateNomisId() {
  const nomisId = uuid().substring(0, 8);
  console.log('Generated NomisId for test: ', nomisId);
  return nomisId;
}

describe('/api/viper/:nomisId', () => {
  const nomisId = generateNomisId();

  before(function beforeTests() {
    this.timeout(5000);
    if (!config.viper.enabled) {
      return primeDatabase(nomisId);
    }
    return primeMock({
      request: {
        method: 'GET',
        urlPattern: `/analytics/viper/${nomisId}`,
        headers: {
          'API-Key': {
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
    });
  });

  after(() => superagent
      .post(url.resolve(`${config.viper.url}`, '/__admin/reset'))
      .send());

  it('returns a viper rating for a known nomis id', function test() {
    this.timeout(5000);
    return request(baseUrl).get(`/api/viper/${nomisId}`)
      .expect(200)
      .then((res) => {
        expect(res.body).to.eql({ nomisId, viperRating: 0.42 });
      });
  });

  context('when using actual API', () => {
    before(() => {
      if (!config.viper.enabled) {
        this.skip();
      }
    });

    it('returns a viper rating for a known nomis id when response contains extra fields', function test() {
      const newNomisId = generateNomisId();
      this.timeout(5000);
      return primeMock({
        request: {
          method: 'GET',
          urlPattern: `/analytics/viper/${newNomisId}`,
          headers: {
            'API-Key': {
              equalTo: 'valid-subscription-key',
            },
          },
        },
        response: {
          status: 200,
          body: `{"nomsId": "${newNomisId}", "viperRating": 0.42, "extraDataKey": "extra data value"}`,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      })
        .then(() =>
          request(baseUrl).get(`/api/viper/${newNomisId}`)
            .expect(200)
            .then((res) => {
              expect(res.body).to.eql({ nomisId: newNomisId, viperRating: 0.42 });
            }),
        );
    });

    it('returns a 404 (not found) when an unauthorised (401) response is received', function test() {
      this.timeout(5000);
      return primeMock({
        request: {
          method: 'GET',
          urlPattern: '/analytics/viper/foo-401',
        },
        response: {
          status: 401,
          body: '{"code": "Unauthorised", "message": "Unauthorized; User or application must authenticate"}',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      })
        .then(() =>
          request(baseUrl).get('/api/viper/foo-401')
            .expect(404),
        ).then((res) => {
          expect(res.body).to.eql({ messasge: 'Error retrieving viper rating for nomisId: foo-401. The cause was: Not found' });
        });
    });

    it('returns a 404 (not found) when a forbidden (403) response is received', function test() {
      this.timeout(5000);
      primeMock({
        request: {
          method: 'GET',
          urlPattern: '/analytics/viper/foo-403',
        },
        response: {
          status: 403,
          body: '{"code": "Forbidden","message": "Forbidden; User not authorized to take this action"}',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      })
        .then(() =>
          request(baseUrl).get('/api/viper/foo-403')
            .expect(404)
            .then((res) => {
              expect(res.body).to.eql({ messasge: 'Error retrieving viper rating for nomisId: foo-403. The cause was: Not found' });
            }),
        );
    });

    it('returns a 404 (not found) when a bad request (400) response is received', function test() {
      this.timeout(5000);
      return primeMock({
        request: {
          method: 'GET',
          urlPattern: '/analytics/viper/foo-400',
        },
        response: {
          status: 400,
          body: '{"code": "InvalidArgument","message": "nomsId (INVALID): Invalid characters"}',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      })
        .then(() =>
          request(baseUrl).get('/api/viper/foo-400')
            .expect(404)
            .then((res) => {
              expect(res.body).to.eql({ messasge: 'Error retrieving viper rating for nomisId: foo-400. The cause was: Not found' });
            }),
        );
    });

    it('returns a 404 (not found) when an unexpected error (500) response is received', function test() {
      this.timeout(5000);
      return primeMock({
        request: {
          method: 'GET',
          urlPattern: '/analytics/viper/foo-500',
        },
        response: {
          status: 500,
          body: '{"code": "UnexpectedError", "message": "Internal Server Error"}',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      })
        .then(() =>
          request(baseUrl).get('/api/viper/foo-500')
            .expect(404)
            .then((res) => {
              expect(res.body).to.eql({ messasge: 'Error retrieving viper rating for nomisId: foo-500. The cause was: Not found' });
            }),
        );
    });

    it('returns a 404 (not found) when an empty response is received', function test() {
      this.timeout(5000);
      return primeMock({
        request: {
          method: 'GET',
          urlPattern: '/analytics/viper/foo-empty',
        },
        response: {
          fault: 'EMPTY_RESPONSE',
        },
      })
        .then(() =>
          request(baseUrl).get('/api/viper/foo-empty')
            .expect(404)
            .then((res) => {
              expect(res.body).to.eql({ messasge: 'Error retrieving viper rating for nomisId: foo-empty. The cause was: Not found' });
            }),
        );
    });

    it('returns a 404 (not found) when connection is closed during response', function test() {
      this.timeout(5000);
      return primeMock({
        request: {
          method: 'GET',
          urlPattern: '/analytics/viper/foo-closed',
        },
        response: {
          fault: 'RANDOM_DATA_THEN_CLOSE',
        },
      })
        .then(() =>
          request(baseUrl).get('/api/viper/foo-closed')
            .expect(404)
            .then((res) => {
              expect(res.body).to.eql({ messasge: 'Error retrieving viper rating for nomisId: foo-closed. The cause was: Not found' });
            }),
        );
    });

    it('returns a 404 (not found) when response is malformed', function test() {
      this.timeout(5000);
      return primeMock({
        request: {
          method: 'GET',
          urlPattern: '/analytics/viper/foo-mal',
        },
        response: {
          fault: 'MALFORMED_RESPONSE_CHUNK',
        },
      })
        .then(() =>
          request(baseUrl).get('/api/viper/foo-mal')
            .expect(404)
            .then((res) => {
              expect(res.body.messasge).to.contain('Error retrieving viper rating for nomisId: foo-mal. The cause was: Invalid body:');
            }),
        );
    });

    it('returns a 404 (not found) when response body is invalid', function test() {
      this.timeout(5000);
      primeMock({
        request: {
          method: 'GET',
          urlPattern: '/analytics/viper/foo-invalid',
        },
        response: {
          status: 200,
          body: '{"id": "1234", "value": 0.42}',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      })
        .then(() =>
          request(baseUrl).get('/api/viper/foo-invalid')
            .expect(404),
        )
        .then((res) => {
          expect(res.body).to.eql({ messasge: 'Error retrieving viper rating for nomisId: foo-invalid. The cause was: Invalid body: {"id": "1234", "value": 0.42}' });
        });
    });

    it('returns a 404 (not found) when response is the wrong format', function test() {
      this.timeout(5000);
      return primeMock({
        request: {
          method: 'GET',
          urlPattern: '/analytics/viper/foo-wrong',
        },
        response: {
          status: 200,
          body: '<nomId="1234" value="0.42">',
          headers: {
            'Content-Type': 'application/xml',
          },
        },
      })
        .then(() =>
          request(baseUrl).get('/api/viper/foo-wrong')
            .expect(404)
            .then((res) => {
              expect(res.body).to.eql(
                { messasge: 'Error retrieving viper rating for nomisId: foo-wrong. The cause was: Invalid body: undefined' });
            }),
        );
    });

    it('returns a 404 (not found) when no response is receive within timeout limit', function test() {
      this.timeout(5000);
      return primeMock({
        request: {
          method: 'GET',
          urlPattern: '/analytics/viper/foo-timeout',
        },
        response: {
          status: 200,
          body: '{"nomsId": "foo-timeout", "viperRating": 0.99}',
          headers: {
            'Content-Type': 'application/json',
          },
          fixedDelayMilliseconds: 2100,
        },
      })
        .then(() =>
          request(baseUrl).get('/api/viper/foo-timeout')
            .expect(404)
            .then((res) => {
              expect(res.body).to.eql(
                {
                  messasge: 'Error retrieving viper rating for nomisId: foo-timeout. The cause was: Not found',
                });
            }),
        );
    });
  });

  it('returns a 404 (not found) for an unknown nomis id', function test() {
    this.timeout(5000);
    const unknownNomisId = uuid().substring(0, 8);
    return request(baseUrl).get(`/api/viper/${unknownNomisId}`)
      .expect(404)
      .then((res) => {
        expect(res.body).to.eql({ messasge: `Error retrieving viper rating for nomisId: ${unknownNomisId}. The cause was: Not found` });
      });
  });
});

