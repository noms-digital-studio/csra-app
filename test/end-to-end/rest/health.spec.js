import request from 'supertest';
import { expect } from 'chai';

describe('/health', () => {
  it('displays the health status of the app', async function test() {
    this.timeout(25000);
    const result = await request(process.env.APP_BASE_URL).get('/health').expect(200);

    expect(result.body).to.have.property('status').which.equals('OK');
    expect(result.body).to.have.property('buildNumber').which.is.a('string');
    expect(result.body).to.have.property('gitRef').which.matches(/^[a-z\d]{40}$/);
    expect(result.body).to.have.property('gitDate').which.matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    expect(result.body).to.have.property('questionHash').which.is.an('object');
    expect(result.body).to.have.deep.property('checks.db', 'OK');
    expect(result.body).to.have.deep.property('checks.viperRestService', 'OK');
    expect(result.body).to.have.deep.property('checks.elite2RestService', 'OK');
  });
});
