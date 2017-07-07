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
    .into('viper')
    .then((error, result) => {
      if (error) {
        console.log('error: ', error);
        throw new Error(error);
      }

      return result;
    });
}

function primeMock(mapping) {
  return new Promise((resolve, reject) => {
    superagent
      .post(url.resolve(`${config.viperRestServiceHost}`, '/__admin/mappings'))
      .send(mapping)
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

  before(function beforeTests(done) {
    this.timeout(5000);
    if (process.env.USE_VIPER_SERVICE === 'false') {
      primeDatabase(nomisId)
        .then(done)
        .catch(done);
    } else {
      primeMock({
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
      })
        .then(done)
        .catch(done);
    }
  });

  it('returns a viper rating for a known nomis id', function test(done) {
    this.timeout(5000);
    request(baseUrl).get(`/api/viper/${nomisId}`)
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
          return;
        }
        expect(res.body).to.eql({ nomisId, viperRating: 0.42 });
        done();
      });
  });

  it('returns a viper rating for a known nomis id when response contains extra fields', function test(done) {
    if (process.env.USE_VIPER_SERVICE === 'false') {
      done();
      return;
    }

    this.timeout(5000);
    primeMock({
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
        body: `{"nomsId": "${nomisId}", "viperRating": 0.42, "extraDataKey": "extra data value"}`,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    })
      .then(() => {
        request(baseUrl).get(`/api/viper/${nomisId}`)
          .expect(200)
          .end((err, res) => {
            if (err) {
              done(err);
              return;
            }
            expect(res.body).to.eql({ nomisId, viperRating: 0.42 });
            done();
          });
      })
      .catch(done);
  });

  it('returns a 404 (not found) when an unauthorised (401) response is received', function test(done) {
    if (process.env.USE_VIPER_SERVICE === 'false') {
      done();
      return;
    }

    this.timeout(5000);
    primeMock({
      request: {
        method: 'GET',
        urlPattern: '/analytics/viper/foo',
      },
      response: {
        status: 401,
        body: '{"code": "Unauthorised", "message": "Unauthorized; User or application must authenticate"}',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    })
      .then(() => {
        request(baseUrl).get('/api/viper/foo')
          .expect(404)
          .end((err, res) => {
            if (err) {
              done(err);
              return;
            }
            expect(res.body).to.eql({ messasge: 'Error retrieving viper rating for nomisId: foo. The cause was: Not found' });
            done();
          });
      })
      .catch(done);
  });

  it('returns a 404 (not found) when a forbidden (403) response is received', function test(done) {
    if (process.env.USE_VIPER_SERVICE === 'false') {
      done();
      return;
    }

    this.timeout(5000);
    primeMock({
      request: {
        method: 'GET',
        urlPattern: '/analytics/viper/foo',
      },
      response: {
        status: 403,
        body: '{"code": "Forbidden","message": "Forbidden; User not authorized to take this action"}',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    })
      .then(() => {
        request(baseUrl).get('/api/viper/foo')
          .expect(404)
          .end((err, res) => {
            if (err) {
              done(err);
              return;
            }
            expect(res.body).to.eql({ messasge: 'Error retrieving viper rating for nomisId: foo. The cause was: Not found' });
            done();
          });
      })
      .catch(done);
  });

  it('returns a 404 (not found) when a bad request (400) response is received', function test(done) {
    if (process.env.USE_VIPER_SERVICE === 'false') {
      done();
      return;
    }

    this.timeout(5000);
    primeMock({
      request: {
        method: 'GET',
        urlPattern: '/analytics/viper/foo',
      },
      response: {
        status: 400,
        body: '{"code": "InvalidArgument","message": "nomsId (INVALID): Invalid characters"}',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    })
      .then(() => {
        request(baseUrl).get('/api/viper/foo')
          .expect(404)
          .end((err, res) => {
            if (err) {
              done(err);
              return;
            }
            expect(res.body).to.eql({ messasge: 'Error retrieving viper rating for nomisId: foo. The cause was: Not found' });
            done();
          });
      })
      .catch(done);
  });

  it('returns a 404 (not found) when an unexpected error (500) response is received', function test(done) {
    if (process.env.USE_VIPER_SERVICE === 'false') {
      done();
      return;
    }

    this.timeout(5000);
    primeMock({
      request: {
        method: 'GET',
        urlPattern: '/analytics/viper/foo',
      },
      response: {
        status: 500,
        body: '{"code": "UnexpectedError", "message": "Internal Server Error"}',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    })
      .then(() => {
        request(baseUrl).get('/api/viper/foo')
          .expect(404)
          .end((err, res) => {
            if (err) {
              done(err);
              return;
            }
            expect(res.body).to.eql({ messasge: 'Error retrieving viper rating for nomisId: foo. The cause was: Not found' });
            done();
          });
      })
      .catch(done);
  });

  it('returns a 404 (not found) when an empty response is received', function test(done) {
    if (process.env.USE_VIPER_SERVICE === 'false') {
      done();
      return;
    }

    this.timeout(5000);
    primeMock({
      request: {
        method: 'GET',
        urlPattern: '/analytics/viper/foo',
      },
      response: {
        fault: 'EMPTY_RESPONSE',
      },
    })
      .then(() => {
        request(baseUrl).get('/api/viper/foo')
          .expect(404)
          .end((err, res) => {
            if (err) {
              done(err);
              return;
            }
            expect(res.body).to.eql({ messasge: 'Error retrieving viper rating for nomisId: foo. The cause was: Not found' });
            done();
          });
      })
      .catch(done);
  });

  it('returns a 404 (not found) when connection is closed during response', function test(done) {
    if (process.env.USE_VIPER_SERVICE === 'false') {
      done();
      return;
    }

    this.timeout(5000);
    primeMock({
      request: {
        method: 'GET',
        urlPattern: '/analytics/viper/foo',
      },
      response: {
        fault: 'RANDOM_DATA_THEN_CLOSE',
      },
    })
      .then(() => {
        request(baseUrl).get('/api/viper/foo')
          .expect(404)
          .end((err, res) => {
            if (err) {
              done(err);
              return;
            }
            expect(res.body).to.eql({ messasge: 'Error retrieving viper rating for nomisId: foo. The cause was: Not found' });
            done();
          });
      })
      .catch(done);
  });

  it('returns a 404 (not found) when response is malformed', function test(done) {
    if (process.env.USE_VIPER_SERVICE === 'false') {
      done();
      return;
    }

    this.timeout(5000);
    primeMock({
      request: {
        method: 'GET',
        urlPattern: '/analytics/viper/foo',
      },
      response: {
        fault: 'MALFORMED_RESPONSE_CHUNK',
      },
    })
      .then(() => {
        request(baseUrl).get('/api/viper/foo')
          .expect(404)
          .end((err, res) => {
            if (err) {
              done(err);
              return;
            }
            expect(res.body.messasge).to.contain('Error retrieving viper rating for nomisId: foo. The cause was: Invalid body:');
            done();
          });
      })
      .catch(done);
  });

  it('returns a 404 (not found) when response body is invalid', function test(done) {
    if (process.env.USE_VIPER_SERVICE === 'false') {
      done();
      return;
    }

    this.timeout(5000);
    primeMock({
      request: {
        method: 'GET',
        urlPattern: '/analytics/viper/foo',
      },
      response: {
        status: 200,
        body: '{"id": "1234", "value": 0.42}',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    })
      .then(() => {
        request(baseUrl).get('/api/viper/foo')
          .expect(404)
          .end((err, res) => {
            if (err) {
              done(err);
              return;
            }
            expect(res.body).to.eql({ messasge: 'Error retrieving viper rating for nomisId: foo. The cause was: Invalid body: {"id": "1234", "value": 0.42}' });
            done();
          });
      })
      .catch(done);
  });

  it('returns a 404 (not found) when response is the wrong format', function test(done) {
    if (process.env.USE_VIPER_SERVICE === 'false') {
      done();
      return;
    }

    this.timeout(5000);
    primeMock({
      request: {
        method: 'GET',
        urlPattern: '/analytics/viper/foo',
      },
      response: {
        status: 200,
        body: '<nomId="1234" value="0.42">',
        headers: {
          'Content-Type': 'application/xml',
        },
      },
    })
      .then(() => {
        request(baseUrl).get('/api/viper/foo')
          .expect(404)
          .end((err, res) => {
            if (err) {
              done(err);
              return;
            }
            expect(res.body).to.eql(
              { messasge: 'Error retrieving viper rating for nomisId: foo. The cause was: Invalid body: undefined' });
            done();
          });
      })
      .catch(done);
  });

  it('returns a 404 (not found) when no response is receive within timeout limit', function test(done) {
    if (process.env.USE_VIPER_SERVICE === 'false') {
      done();
      return;
    }

    this.timeout(5000);
    primeMock({
      request: {
        method: 'GET',
        urlPattern: '/analytics/viper/foo',
      },
      response: {
        status: 200,
        body: '{"nomsId": "foo", "viperRating": 0.99}',
        headers: {
          'Content-Type': 'application/json',
        },
        fixedDelayMilliseconds: 2100,
      },
    })
      .then(() => {
        request(baseUrl).get('/api/viper/foo')
          .expect(404)
          .end((err, res) => {
            if (err) {
              done(err);
              return;
            }
            expect(res.body).to.eql(
              {
                messasge: 'Error retrieving viper rating for nomisId: foo. The cause was: Not found',
              });
            done();
          });
      })
      .catch(done);
  });

  it('returns a 404 (not found) for an unknown nomis id', function test(done) {
    this.timeout(5000);
    const unknownNomisId = uuid().substring(0, 8);
    request(baseUrl).get(`/api/viper/${unknownNomisId}`)
      .expect(404)
      .end((err, res) => {
        if (err) {
          done(err);
          return;
        }
        expect(res.body).to.eql({ messasge: `Error retrieving viper rating for nomisId: ${unknownNomisId}. The cause was: Not found` });
        done();
      });
  });
});

