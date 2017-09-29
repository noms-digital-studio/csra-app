import { json } from 'body-parser';
import request from 'supertest';
import sinon from 'sinon';
import express from 'express';
import createSignInEndpoint from '../../../../server/routes/signIn';

const app = express();
const fakeSignInService = sinon.stub();
app.use(json());
app.use(createSignInEndpoint(fakeSignInService));

describe('POST /signin', () => {
  it('responds with status OK (200) when signed in correctly', () => {
    fakeSignInService.signIn = sinon.stub().resolves({ forename: 'firstname', surname: 'lastname' });

    return request(app).post('/').send({
      username: 'myUsername',
      password: 'myPassword',
    })
    .expect(200)
    .expect((res) => {
      expect(res.body).to.eql({ forename: 'firstname', surname: 'lastname' });
    });
  });
});
