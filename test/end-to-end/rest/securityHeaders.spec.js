import request from 'supertest';
import { expect } from 'chai';

describe('Security headers', () => {
  it('returns a response with security headers present', async function test() {
    this.timeout(25000);
    const result = await request(process.env.APP_BASE_URL).get('/');

    expect(result.headers).to.have.property('x-dns-prefetch-control');
    expect(result.headers).to.have.property('x-frame-options');
    expect(result.headers).to.have.property('x-download-options');
    expect(result.headers).to.have.property('x-content-type-options');
    expect(result.headers).to.have.property('x-xss-protection');
  });
});
