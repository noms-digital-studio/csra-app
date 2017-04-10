import nock from 'nock';
import { expect } from 'chai';
import { spy } from 'sinon';
import poolEndpointForGitRef from '../../../../utils/scripts/wait-for-deployment';

describe('Wait for deploy script', () => {
  const appUrl = 'http://csra-mock.hmpps.dsd.io';
  const buildNumber = 'foo-build-number';
  const gitRef = 'foo-git-reference';

  before(() => {
    nock(appUrl).get('/health').reply(200, {
      status: 'OK',
      buildNumber,
      gitRef,
    });
  });

  it('calls the onSuccess callback if health endpoint returns "OK"', function (done) {
    this.timeout(2000);

    const onSuccess = (response) => {
      expect(response).to.be.eql({
        status: 'OK',
        buildNumber: 'foo-build-number',
        gitRef: 'foo-git-reference',
      });
      done();
    };

    poolEndpointForGitRef({
      retryCount: 1,
      appUrl,
      gitRef,
      onSuccess,
    });
  });

  it('calls the onError when the function fails to get a status of "OK" from the endpoint', () => {
    const onError = spy();
    poolEndpointForGitRef({
      retryCount: 0,
      appUrl,
      gitRef: 'unknown-git-reference',
      onError,
    });

    expect(onError.calledOnce).to.equal(true);
  });
});
