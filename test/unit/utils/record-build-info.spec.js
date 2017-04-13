/* eslint-disable consistent-return */

import rimraf from 'rimraf';
import fs from 'fs';
import path from 'path';
import { expect } from 'chai';

import { recordBuildInfoTo } from '../../../utils';

describe('Record build info', () => {
  afterEach(() => rimraf.sync(path.resolve(__dirname, 'temp')));

  it('stores build information into a json file', (done) => {
    const file = path.resolve(__dirname, 'temp/build-info.json');
    const buildInfo = { buildNumber: 'foo', gitRef: 'bar' };
    recordBuildInfoTo(file, buildInfo, () => {
      fs.readFile(file, 'utf-8', (error, data) => {
        if (error) return done(error);
        expect(data).equal(JSON.stringify(buildInfo));
        done();
      });
    });
  });
});
