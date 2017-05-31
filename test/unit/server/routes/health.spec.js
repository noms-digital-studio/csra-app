import path from 'path';
import fs from 'fs';
import rimraf from 'rimraf';
import request from 'supertest';
import express from 'express';
import healthEndpoint from '../../../../server/routes/health';

describe('GET /health', () => {
  let app;
  before(() => {
    app = express();
    app.use('/health', healthEndpoint);
  });

  it('responds with { status: "OK" }',
    () => request(app)
      .get('/health')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect((res) => {
        expect(res.body).to.have.property('status', 'OK');
      }),
  );

  context('when the build-info.json file is present', () => {
    const projectRoot = path.resolve(__dirname, '../../../../');
    const buildJson = path.resolve(projectRoot, 'build-info.json');

    before((done) => {
      fs.writeFile(buildJson, JSON.stringify({
        buildNumber: '123',
        gitRef: 'deadbeeffaceddeaffadeddad',
        any: { other: 'stuff' },
      }, null, 2), done);

      // flush require cache since we changed the file
      delete require.cache[require.resolve(buildJson)];
    });

    after(done => rimraf(buildJson, done));

    it('adds the build info into the status response',
      () => request(app)
        .get('/health')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
          expect(res.body).to.have.property('buildNumber', '123');
          expect(res.body).to.have.property('gitRef', 'deadbeeffaceddeaffadeddad');
          expect(res.body).to.have.deep.property('any.other', 'stuff');
        }),
    );
  });
});
