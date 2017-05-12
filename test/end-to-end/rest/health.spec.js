import request from 'supertest';
import { expect } from 'chai';

describe('/health', () => {
  it('displays the health status of the app', function test(done) {
    this.timeout(5000);
    const baseUrl = process.env.APP_BASE_URL;
    request(baseUrl).get('/health')
      .expect(200)
      .end((err, res) => {
        if (err) done(err);
        expect(res.body.status).to.equal('OK');
        done();
      });
  });
});

