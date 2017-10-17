/* eslint-disable no-console */
import request from 'supertest';
import parsePassportSessionCookie from '../../util/cookies';

const agent = request.agent(process.env.APP_BASE_URL);

describe('/signin', () => {
  it('signs on correctly', async () => {
    const result = await agent.post('/signin').send('username=officer&password=password').expect(302);
    expect(result.headers.location).to.eql('/');
    expect(result.headers['set-cookie'][0]).to.include('express:sess=');
    const userDetails = { forename: 'John', surname: 'Smith', username: 'officer', email: 'officer@hmpps.org' };
    const userDetailsString = JSON.stringify({ passport: { user: userDetails } });
    expect(parsePassportSessionCookie(result)).to.equal(userDetailsString);
  });

  it('returns unauthorised when user creds are wrong', async () => {
    const result = await agent.post('/signin').send('username=officer&password=p*sw3d').expect(302);
    expect(result.headers.location).to.eql('/signin');
    expect(parsePassportSessionCookie(result)).to.contains('Invalid user credentials');
  });

  it('returns ELite 2 failure message', async () => {
    const result = await agent.post('/signin').send('username=officer3&password=password').expect(302);
    expect(result.headers.location).to.eql('/signin');
    expect(parsePassportSessionCookie(result)).to.contains('Elite 2 API failure');
  });

  it('returns MoJ gateway forbidden message', async () => {
    const result = await agent.post('/signin').send('username=officer4&password=password').expect(302);
    expect(result.headers.location).to.eql('/signin');
    expect(parsePassportSessionCookie(result)).to.contains('MoJ API gateway rejected the request to the Elite 2 API');
  });
});
