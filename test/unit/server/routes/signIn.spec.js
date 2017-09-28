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
    fakeSignInService.signin = sinon.stub().resolves({ token: 'xxx.yyy.zzz' });

    return request(app).post('/').send({
      username: 'myUsername',
      password: 'myPassword',
    })
    .expect(200);
  });
});
