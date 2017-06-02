import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';

describe('bin/record-build-info', () => {
  const projectRoot = path.resolve(__dirname, '../../../');
  const buildInfoPath = path.resolve(projectRoot, 'build-info.json');

  before(done => exec(
    './bin/record-build-info',
    {
      cwd: projectRoot,
      env: {
        PATH: process.env.PATH,
        BUILD_NUMBER: '123',
        GIT_REF: 'deadbeeffaceddeaffadeddad',
        GIT_DATE: '2017-05-31T15:35:26+00:00',
      },
    },
    done,
  ));

  it('creates build-info.json', () => {
    expect(fs.existsSync(buildInfoPath)).to.eql(true);
  });

  describe('build-info.json content', () => {
    let info;
    before(() => {
      info = JSON.parse(fs.readFileSync(buildInfoPath, 'utf-8'));
    });

    it('has buildNumber', () =>
      expect(info).to.have.property('buildNumber', '123'));
    it('has gitRef', () =>
      expect(info).to.have.property('gitRef', 'deadbeeffaceddeaffadeddad'));
    it('has gitDate', () =>
      expect(info).to.have.property('gitDate', '2017-05-31T15:35:26+00:00'));

    it('has questionHash collection', () =>
      expect(info).to.have.property('questionHash'));
    it('has questionHash for risk', () =>
      expect(info.questionHash)
        .to.have.property('risk')
        .which.matches(/[\da-f]{40}/));
    it('has questionHash for healthcare', () =>
      expect(info.questionHash)
        .to.have.property('healthcare')
        .which.matches(/[\da-f]{40}/));
  });
});
