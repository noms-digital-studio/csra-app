import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';

import createAppInfoService from '../../../../server/services/app-info';

describe('app-info service', () => {
  let appInfo;

  context('with build-info.json', () => {
    let buildInfo;

    const projectRoot = path.resolve(__dirname, '../../../../');
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
    before(() => {
      buildInfo = JSON.parse(fs.readFileSync(buildInfoPath, 'utf-8'));

      appInfo = createAppInfoService(buildInfo);
    });

    it('provides all build info', () => {
      expect(appInfo.getBuildInfo()).to.eql(buildInfo);
    });
    it('provides gitRef from build info', () => {
      expect(appInfo.getGitRef()).to.eql('deadbeeffaceddeaffadeddad');
    });
    it('provides gitDate from build info', () => {
      expect(appInfo.getGitDate()).to.eql(new Date('2017-05-31T15:35:26Z'));
    });
    it('provides questionHash (risk) from build info', () => {
      expect(appInfo.getQuestionHash('risk'))
        .to.eql(buildInfo.questionHash.risk);
    });
    it('provides questionHash (healthcare) from build info', () => {
      expect(appInfo.getQuestionHash('healthcare'))
        .to.eql(buildInfo.questionHash.healthcare);
    });
  });

  context('without build-info.json', () => {
    before(() => {
      appInfo = createAppInfoService();
    });
    it('provides all build info', () => {
      const info = appInfo.getBuildInfo();
      expect(info).to.have.keys('buildNumber', 'gitRef', 'gitDate', 'questionHash');
      expect(info.questionHash).to.have.keys('risk', 'healthcare');
    });
    it('provides gitRef from .git', () => {
      expect(appInfo.getGitRef()).to.match(/^[a-f\d]{40}$/);
    });
    it('provides gitDate from .git', () => {
      expect(appInfo.getGitDate()).to.be.a('date');
    });
    it('provides questionHash (risk) from current file', () => {
      expect(appInfo.getQuestionHash('risk')).to.match(/^[a-f\d]{40}$/);
    });
    it('provides questionHash (healthcare) from build info', () => {
      expect(appInfo.getQuestionHash('healthcare')).to.match(/^[a-f\d]{40}$/);
    });
  });
});
