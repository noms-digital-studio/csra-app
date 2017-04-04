import request from 'supertest';
import app from '../../server/app';

describe('App', () => {
  describe('GET /unknown', () => {
    it('responds with a 404 when a resource is not found', (done) => {
      request(app).get('/unknown').expect(404, 'Resource not found', done);
    });
  });
});
