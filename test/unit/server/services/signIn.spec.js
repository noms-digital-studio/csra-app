import nock from 'nock';
import createSignInService from '../../../../server/services/signIn';
import config from '../../../../server/config';

describe('signIn service', () => {
  let signInService;
  let fakeElite2RestService;

  beforeEach(() => {
    fakeElite2RestService = nock(`${config.elite2.url}`);
    signInService = createSignInService();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe('successful sign in', () => {
    it('signs in when Elite 2 returns a JWT bearer token', () => {
      const payload = btoa(JSON.stringify(
        {
          sub: 'AUSER',
          deviceFingerprintHashCode: -656086319,
          allowRefreshToken: false,
          userPrincipal: {
            username: 'AUSER',
            password: null,
            authorities: [{ authority: 'ROLE_A' }, { authority: 'ROLE_B' }],
            additionalProperties: {},
            enabled: true,
            accountNonExpired: true,
            accountNonLocked: true,
            credentialsNonExpired: true,
          },
          iss: 'http://www.foobar.net',
          iat: 1508507284,
          exp: 1508509084,
        }));

      const algorithm = btoa(JSON.stringify({ alg: 'HS512' }));
      const aToken = `Bearer ${algorithm}.${payload}.zzz`;

      fakeElite2RestService
      .post('/users/login')
      .reply(200, {
        token: aToken,
        issuedAt: 1506093099586,
        expiration: 1506094899586,
        refreshToken: 'Bearer AAA.BBB.CCC',
        refreshExpiration: 1506096699586,
      });

      fakeElite2RestService
      .get('/users/me')
      .reply(200, {
        staffId: 123,
        username: 'username',
        firstName: 'firstname',
        lastName: 'lastname',
        email: 'email@hmpps',
        thumbnailId: 0,
        activeCaseLoadId: 'activeCaseLoadId',
      });

      return signInService.signIn('myUsername', 'myPassword')
      .then((result) => {
        expect(result).to.eql({
          forename: 'firstname',
          surname: 'lastname',
          eliteAuthorisationToken: aToken,
          username: 'username',
          email: 'email@hmpps',
          authorities: [{ authority: 'ROLE_A' }, { authority: 'ROLE_B' }],
        });
      });
    });
  });

  describe('unsuccessful sign in', () => {
    it('fails when credentials are deemed incorrect', () => {
      fakeElite2RestService
      .post('/users/login')
      .reply(401, {
        status: 401,
        userMessage: 'Invalid user credentials.',
        developerMessage: 'Authentication credentials provided are not valid.',
      });

      return expect(signInService.signIn('myUsername', 'myPassword')).to.be.rejectedWith(Error, 'Invalid user credentials');
    });

    it('fails when elite 2 is broken', () => {
      fakeElite2RestService
      .post('/users/login')
      .reply(500, {
        status: 500,
        userMessage: 'Expensive database has failed',
        developerMessage: 'Column not found but I won`t tell you which one',
      });

      return expect(signInService.signIn('myUsername', 'myPassword')).to.be.rejectedWith(Error, 'Elite 2 API failure');
    });

    it('fails when the MoJ API gateway reject the reuqest', () => {
      fakeElite2RestService
      .post('/users/login')
      .reply(403, 'Authorization header missing');

      return expect(signInService.signIn('myUsername', 'myPassword'))
        .to.be.rejectedWith(Error, 'MoJ API gateway rejected the request to the Elite 2 API');
    });
  });
});
