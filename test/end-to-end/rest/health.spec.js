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
        expect(res.body).to.have.property('status')
          .which.equals('OK');
        expect(res.body).to.have.property('buildNumber')
          .which.is.a('string');
        expect(res.body).to.have.property('gitRef')
          .which.matches(/^[a-z\d]{40}$/);
        expect(res.body).to.have.property('gitDate')
          .which.matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
        expect(res.body).to.have.property('questionHash')
          .which.is.an('object');
        done();
      });
  });
});

