import { urlencoded } from 'body-parser';
import session from 'express-session';
import request from 'supertest';
import sinon from 'sinon';
import express from 'express';
import createSignInEndpoint from '../../../../server/routes/signIn';

const app = express();
const fakeSignInService = sinon.stub();
app.use(urlencoded({ extended: true }));
app.use(session({ secret: 'test' }));
app.use(createSignInEndpoint(fakeSignInService));

describe.only('POST /signin', () => {
  it('responds with status OK (200) when signed in correctly', () => {
    fakeSignInService.signIn = sinon.stub().resolves({ forename: 'firstname', surname: 'lastname' });

    return request(app).post('/').send('username=officer&password=password')
    .expect(302)
    .expect((res) => {
      expect(res.headers.location).to.eql('/');
    });
  });
});
