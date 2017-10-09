/* eslint-disable no-console */
import superagent from 'superagent';
import request from 'supertest';
import uuid from 'uuid/v4';
import url from 'url';
import config from '../../../server/config';

async function primeMock(mapping) {
  return superagent.post(url.resolve(`${config.viper.url}`, '/__admin/mappings')).send(mapping);
}

function generateNomisId() {
  const nomisId = uuid().substring(0, 8);
  return nomisId;
}

const agent = request.agent(process.env.APP_BASE_URL);

describe('/api/viper/:nomisId', () => {
  const nomisId = generateNomisId();

  before(async () => {
    const result = await agent.post('/signin').send('username=officer&password=password').expect(302);

    expect(result.headers.location).to.eql('/');

    await primeMock({
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

  it('returns a viper rating for a known nomis id', async () => {
    const result = await agent.get(`/api/viper/${nomisId}`).expect(200);

    expect(result.body).to.eql({ nomisId, viperRating: 0.42 });
  });

  it('returns a viper rating for a known nomis id when response contains extra fields', async () => {
    const newNomisId = generateNomisId();

    await primeMock({
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
    });

    const result = await agent.get(`/api/viper/${newNomisId}`).expect(200);

    expect(result.body).to.eql({ nomisId: newNomisId, viperRating: 0.42 });
  });

  it('returns a 404 (not found) when an unauthorised (401) response is received', async () => {
    await primeMock({
      request: {
        method: 'GET',
        urlPattern: '/analytics/viper/foo-401',
      },
      response: {
        status: 401,
        body:
          '{"code": "Unauthorised", "message": "Unauthorized; User or application must authenticate"}',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    });

    const result = await agent.get('/api/viper/foo-401').expect(404);

    expect(result.body).to.eql({
      messasge: 'Error retrieving viper rating for nomisId: foo-401. The cause was: Not found',
    });
  });

  it('returns a 404 (not found) when a forbidden (403) response is received', async () => {
    await primeMock({
      request: {
        method: 'GET',
        urlPattern: '/analytics/viper/foo-403',
      },
      response: {
        status: 403,
        body:
          '{"code": "Forbidden","message": "Forbidden; User not authorized to take this action"}',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    });

    const result = await agent.get('/api/viper/foo-403').expect(404);

    expect(result.body).to.eql({
      messasge: 'Error retrieving viper rating for nomisId: foo-403. The cause was: Not found',
    });
  });

  it('returns a 404 (not found) when a bad request (400) response is received', async () => {
    await primeMock({
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
    });
    const result = await agent.get('/api/viper/foo-400').expect(404);

    expect(result.body).to.eql({
      messasge: 'Error retrieving viper rating for nomisId: foo-400. The cause was: Not found',
    });
  });

  it('returns a 404 (not found) when an unexpected error (500) response is received', async () => {
    await primeMock({
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
    });

    const result = await agent.get('/api/viper/foo-500').expect(404);

    expect(result.body).to.eql({
      messasge: 'Error retrieving viper rating for nomisId: foo-500. The cause was: Not found',
    });
  });

  it('returns a 404 (not found) when an empty response is received', async () => {
    await primeMock({
      request: {
        method: 'GET',
        urlPattern: '/analytics/viper/foo-empty',
      },
      response: {
        fault: 'EMPTY_RESPONSE',
      },
    });

    const result = await agent.get('/api/viper/foo-empty').expect(404);

    expect(result.body).to.eql({
      messasge: 'Error retrieving viper rating for nomisId: foo-empty. The cause was: Not found',
    });
  });

  it('returns a 404 (not found) when connection is closed during response', async () => {
    await primeMock({
      request: {
        method: 'GET',
        urlPattern: '/analytics/viper/foo-closed',
      },
      response: {
        fault: 'RANDOM_DATA_THEN_CLOSE',
      },
    });

    const result = await agent.get('/api/viper/foo-closed').expect(404);

    expect(result.body).to.eql({
      messasge: 'Error retrieving viper rating for nomisId: foo-closed. The cause was: Not found',
    });
  });

  it('returns a 404 (not found) when response is malformed', async () => {
    await primeMock({
      request: {
        method: 'GET',
        urlPattern: '/analytics/viper/foo-mal',
      },
      response: {
        fault: 'MALFORMED_RESPONSE_CHUNK',
      },
    });

    const result = await agent.get('/api/viper/foo-mal').expect(404);
    expect(result.body.messasge).to.contain('Error retrieving viper rating for nomisId: foo-mal. The cause was: Invalid body:');
  });

  it('returns a 404 (not found) when response body is invalid', async () => {
    await primeMock({
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
    });

    const result = await agent.get('/api/viper/foo-invalid').expect(404);

    expect(result.body).to.eql({ messasge:
      'Error retrieving viper rating for nomisId: foo-invalid. The cause was: Invalid body: {"id": "1234", "value": 0.42}',
    });
  });

  it('returns a 404 (not found) when response is the wrong format', async () => {
    await primeMock({
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
    });

    const result = await agent.get('/api/viper/foo-wrong').expect(404);

    expect(result.body).to.eql({
      messasge:
            'Error retrieving viper rating for nomisId: foo-wrong. The cause was: Invalid body: undefined',
    });
  });

  it('returns a 404 (not found) when no response is receive within timeout limit', async () => {
    await primeMock({
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
    });

    const result = await agent.get('/api/viper/foo-timeout').expect(404);

    expect(result.body).to.eql({
      messasge:
        'Error retrieving viper rating for nomisId: foo-timeout. The cause was: Not found',
    });
  });

  it('returns a 404 (not found) for an unknown nomis id', async () => {
    const unknownNomisId = uuid().substring(0, 8);
    const result = await agent.get(`/api/viper/${unknownNomisId}`).expect(404);

    expect(result.body).to.eql({
      messasge: `Error retrieving viper rating for nomisId: ${unknownNomisId}. The cause was: Not found`,
    });
  });
});
