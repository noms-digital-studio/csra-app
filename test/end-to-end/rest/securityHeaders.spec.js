import request from 'supertest';
import { expect } from 'chai';

describe('Security headers', () => {
  it('returns a response with security headers present', function test(done) {
    this.timeout(5000);
    const baseUrl = process.env.APP_BASE_URL;
    request(baseUrl)
      .get('/')
      .end((err, res) => {
        expect(res.headers).to.not.have.property('x-powered-by');
        expect(res.headers).to.have.property('x-dns-prefetch-control');
        expect(res.headers).to.have.property('x-frame-options');
        expect(res.headers).to.have.property('x-download-options');
        expect(res.headers).to.have.property('x-content-type-options');
        expect(res.headers).to.have.property('x-xss-protection');

        done();
      });
  });
});
