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
      .post('/elite2api/users/login')
      .reply(200, {
        token: 'Bearer XXX.YYY.ZZZ',
        issuedAt: 1506093099586,
        expiration: 1506094899586,
        refreshToken: 'Bearer AAA.BBB.CCC',
        refreshExpiration: 1506096699586,
      });

      fakeElite2RestService
      .get('/elite2api/users/me')
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
        expect(result).to.eql({ forename: 'firstname', surname: 'lastname' });
      });
    });
  });
});
