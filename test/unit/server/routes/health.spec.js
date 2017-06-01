import path from 'path';
import fs from 'fs';
import rimraf from 'rimraf';
import request from 'supertest';
import sinon from 'sinon';
import express from 'express';
import createHealthEndpoint from '../../../../server/routes/health';

describe('GET /health', () => {
  let app;
  let fakeDB;
  beforeEach(() => {
    app = express();
    fakeDB = {
      raw: x => x,
      select: sinon.stub().resolves(),
    };
    app.use('/health', createHealthEndpoint(fakeDB));
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

  context('when the DB isn\'t working', () => {
    beforeEach(() => {
      fakeDB.select.rejects(new Error('it cannae take it captain'));
    });

    it('responds with 500 { status: "ERROR" } and check detail',
      () => request(app)
        .get('/health')
        .expect('Content-Type', /json/)
        .expect(500)
        .expect((res) => {
          expect(res.body).to.have.property('status', 'ERROR');
          expect(res.body)
            .to.have.deep.property('checks.db', 'it cannae take it captain');
        }),
    );
  });

  context('when the build-info.json file is present', () => {
    const projectRoot = path.resolve(__dirname, '../../../../');
    const buildJson = path.resolve(projectRoot, 'build-info.json');

    beforeEach((done) => {
      fs.writeFile(buildJson, JSON.stringify({
        buildNumber: '123',
        gitRef: 'deadbeeffaceddeaffadeddad',
        any: { other: 'stuff' },
      }, null, 2), done);

      // attempt to flush require cache since we changed the file
      try {
        delete require.cache[require.resolve(buildJson)];
      } catch (ex) { /* ignore errors*/ }
    });

    afterEach(done => rimraf(buildJson, done));

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
