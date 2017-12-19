import { urlencoded } from 'body-parser';
import request from 'supertest';
import sinon from 'sinon';
import express from 'express';
import flash from 'connect-flash';
import parsePassportSessionCookie from '../../../util/cookies';

import createSignInEndpoint from '../../../../server/routes/signIn';
import mockAuthentication from '../helpers/mockAuthentication';

describe('POST /signin', () => {
  const app = express();
  const fakeSignInService = sinon.stub();

  mockAuthentication(app, fakeSignInService);
  app.use(flash());
  app.use(urlencoded({ extended: true }));
  app.use(createSignInEndpoint());

  context('Successful sign in', () => {
    it('redirects to "/" path', () => {
      fakeSignInService.signIn = sinon.stub().resolves({
        forename: 'John',
        surname: 'Doe',
        username: 'username',
        email: 'email',
        eliteAuthorisationToken: 'token',
        authorities: [{ authority: 'ROLE_A' }, { authority: 'ROLE_B' }],
      });

      return request(app)
        .post('/')
        .send('username=officer&password=password')
        .expect(302)
        .expect((res) => {
          const userDetails = {
            forename: 'John',
            surname: 'Doe',
            username: 'username',
            email: 'email',
            eliteAuthorisationToken: 'token',
            authorities: [{ authority: 'ROLE_A' }, { authority: 'ROLE_B' }],
          };
          const passportSession = { passport: { user: userDetails } };
          expect(JSON.parse(parsePassportSessionCookie(res))).to.eql(passportSession);
          expect(res.headers.location).to.eql('/');
        });
    });
  });

  context('Unsuccessful sign in', () => {
    it('redirects back to the "/signin" path when the sign in fails', () => {
      const error = new Error('Foo error');
      error.type = 'foo-error';

      fakeSignInService.signIn = sinon.stub().rejects(error);

      return request(app)
        .post('/')
        .send('username=officer&password=password')
        .expect(302)
        .expect((res) => {
          expect(res.headers.location).to.eql('/signin');
        });
    });
  });
});
