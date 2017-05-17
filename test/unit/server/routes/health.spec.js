import path from 'path';
import fs from 'fs';
import rimraf from 'rimraf';
import request from 'supertest';
import express from 'express';
import healthEndpoint from '../../../../server/routes/health';

xdescribe('GET /health', () => {
  let app;
  before(() => {
    app = express();
    app.use('/health', healthEndpoint);
  });

  it('responds with { status: "OK" }', (done) => {
    request(app)
      .get('/health')
      .expect('Content-Type', /json/)
      .expect(200, {
        status: 'OK',
      }, done);
  });

  context('when the build-info.json file is present', () => {
    const filePath = path.resolve(__dirname, '../../../../build-info.json');

    before(() => {
      const buildInfo = { buildNumber: 'foo', gitRef: 'bar' };
      fs.writeFileSync(filePath, JSON.stringify(buildInfo), { encoding: 'utf-8' });
    });

    after(() => {
      rimraf.sync(filePath);
    });

    it('responds with the build information inside the status ended', (done) => {
      const server = express();
      server.use('/health', healthEndpoint);

      request(app)
      .get('/health')
      .expect('Content-Type', /json/)
      .expect(200, {
        status: 'OK',
        buildNumber: 'foo',
        gitRef: 'bar',
      }, done);
    });
  });
});
