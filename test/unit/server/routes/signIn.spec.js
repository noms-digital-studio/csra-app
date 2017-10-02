import { urlencoded } from 'body-parser';
import request from 'supertest';
import sinon from 'sinon';
import express from 'express';

import createSignInEndpoint from '../../../../server/routes/signIn';
import mockAuthentication from '../helpers/mockAuthentication';

describe('POST /signin', () => {
  const app = express();
  const fakeSignInService = sinon.stub();

  mockAuthentication(app, fakeSignInService);

  app.use(urlencoded({ extended: true }));
  app.use(createSignInEndpoint());

  context('Successful sign in', () => {
    it('redirects to "/" path', () => {
      fakeSignInService.signIn = sinon.stub().resolves({ forename: 'John', surname: 'Doe' });

      return request(app)
        .post('/')
        .send('username=officer&password=password')
        .expect(302)
        .expect((res) => {
          expect(res.headers.location).to.eql('/');
        });
    });
  });
});
