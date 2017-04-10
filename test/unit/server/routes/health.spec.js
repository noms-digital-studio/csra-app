import request from 'supertest';
import express from 'express';
import healthEndpoint from '../../../../server/routes/health';

describe('GET /health', () => {
  let app;
  before(() => {
    app = express();
    app.use('/health', healthEndpoint);
  });

  it('responds with { status: "OK" }', (done) => {
    request(app)
      .get('/health')
      .expect('Content-Type', /json/)
      .expect('Content-Length', '15')
      .expect(200, {
        status: 'OK',
      }, done);
  });
});
