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

  describe('successful sign in', () => {
    it('signs in when Elite 2 returns a JWT bearer token', () => {
      fakeElite2RestService
      .post('/users/login')
      .reply(200, {
        token: 'Bearer XXX.YYY.ZZZ',
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
        email: 'email',
        thumbnailId: 0,
        activeCaseLoadId: 'activeCaseLoadId',
      });

      return signInService.signIn('myUsername', 'myPassword')
      .then((result) => {
        expect(result).to.eql({ forename: 'firstname', surname: 'lastname', eliteAuthorisationToken: 'Bearer XXX.YYY.ZZZ' });
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

      return signInService.signIn('myUsername', 'myPassword')
      .then((result) => {
        expect(result).to.eql({
          status: 'UNAUTHORISED ERROR',
          message: 'Invalid user credentials',
        });
      });
    });

    it('fails when elite 2 is broken', () => {
      fakeElite2RestService
      .post('/users/login')
      .reply(500, {
        status: 500,
        userMessage: 'Expensive database has failed',
        developerMessage: 'Column not found but I won`t tell you which one',
      });

      return signInService.signIn('myUsername', 'myPassword')
      .then((result) => {
        expect(result).to.eql({
          status: 'ELITE2 ERROR',
          message: 'Elite 2 API is not working',
        });
      });
    });

    it('fails when the MoJ API gateway reject the reuqest', () => {
      fakeElite2RestService
      .post('/users/login')
      .reply(403, {
        status: 403,
        userMessage: 'Expensive database has failed',
        developerMessage: 'Column not found but I won`t tell you which one',
      });

      return signInService.signIn('myUsername', 'myPassword')
      .then((result) => {
        expect(result).to.eql({
          status: 'MOJ API GATEWAY ERROR',
          message: 'MoJ API gateway reject the request to the Elite 2 API',
        });
      });
    });
  });
});
