import request from 'supertest';
import sinon from 'sinon';
import express from 'express';
import nock from 'nock';
import createHealthEndpoint from '../../../../server/routes/health';
import config from '../../../../server/config';

describe('GET /health', () => {
  let app;
  let fakeDB;
  let getBuildInfo;
  let fakeViperRestService;
  let fakeElite2RestService;

  beforeEach(() => {
    app = express();
    fakeDB = {
      raw: x => x,
      select: sinon.stub().resolves(),
    };
    getBuildInfo = sinon.stub();
    const fakeAppInfo = { getBuildInfo };
    app.use('/health', createHealthEndpoint(fakeDB, fakeAppInfo));
    fakeViperRestService = nock(`${config.viper.url}`);
    fakeElite2RestService = nock(`${config.elite2.url}`);
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('responds with 200 { status: "OK" } when downstream dependencies are healthy', () => {
    fakeViperRestService
      .get('/analytics/health')
      .reply(200, { healthy: true });

    fakeElite2RestService
      .get('/elite2api/info/health')
      .reply(200, { status: 'UP' });

    return request(app)
      .get('/health')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).to.have.property('status', 'OK');
        expect(res.body).to.have.deep.property('checks.db', 'OK');
        expect(res.body).to.have.deep.property('checks.viperRestService', 'OK');
        expect(res.body).to.have.deep.property('checks.elite2RestService', 'OK');
      });
  });

  it('responds with 500 {status: "ERROR" } when viper rest service is unhealthy', () => {
    fakeViperRestService
      .get('/health')
      .reply(500, { healthy: false });

    fakeElite2RestService
    .get('/elite2api/info/health')
    .reply(200, { status: 'UP' });

    return request(app)
      .get('/health')
      .expect(500)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).to.have.property('status', 'ERROR');
        expect(res.body).to.have.deep.property('checks.db', 'OK');
        expect(res.body).to.have.deep.property('checks.viperRestService', 'ERROR');
        expect(res.body).to.have.deep.property('checks.elite2RestService', 'OK');
      });
  });

  it('responds with 500 {status: "ERROR" } when elite 2 rest service is unhealthy', () => {
    fakeViperRestService
    .get('/analytics/health')
    .reply(200, { healthy: true });

    fakeElite2RestService
    .get('/elite2api/info/health')
    .reply(500, { status: 'DOWN' });

    return request(app)
      .get('/health')
      .expect(500)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).to.have.property('status', 'ERROR');
        expect(res.body).to.have.deep.property('checks.db', 'OK');
        expect(res.body).to.have.deep.property('checks.viperRestService', 'OK');
        expect(res.body).to.have.deep.property('checks.elite2RestService', 'ERROR');
      });
  });

  context('when the DB isn\'t working', () => {
    beforeEach(() => {
      fakeDB.select.rejects(new Error('it cannae take it captain'));

      fakeViperRestService
      .get('/analytics/health')
      .reply(200, { healthy: true });

      fakeElite2RestService
      .get('/elite2api/info/health')
      .reply(200, { status: 'UP' });
    });

    it('responds with 500 { status: "ERROR" } and check detail',
      () => request(app)
        .get('/health')
        .expect(500)
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body).to.have.property('status', 'ERROR');
          expect(res.body).to.have.deep.property('checks.db', 'it cannae take it captain');
        }),
    );
  });

  context('when the build-info is present', () => {
    beforeEach(() => {
      getBuildInfo.returns({
        buildNumber: '123',
        gitRef: 'deadbeeffaceddeaffadeddad',
        any: { other: 'stuff' },
      });

      fakeViperRestService
        .get('/analytics/health')
        .reply(200, { healthy: true });

      fakeElite2RestService
      .get('/elite2api/info/health')
      .reply(200, { status: 'UP' });
    });

    it('adds the build info into the status response',
      () => request(app)
        .get('/health')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body).to.have.property('buildNumber', '123');
          expect(res.body).to.have.property('gitRef', 'deadbeeffaceddeaffadeddad');
          expect(res.body).to.have.deep.property('any.other', 'stuff');
        }),
    );
  });
});
