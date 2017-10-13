const superagent = require('superagent');
const url = require('url');
const config = require('../config');
const generateApiGatewayToken = require('../apiGateway');
const { logger: log } = require('./logger');

async function signIn(username, password) {
  log.info(`Signing in user: ${username}`);
  const result = await superagent
    .post(url.resolve(`${config.elite2.url}`, 'users/login'))
    .set('Authorization', `Bearer ${generateApiGatewayToken()}`)
    .send({
      username,
      password,
    })
    .timeout({
      response: 2000,
      deadline: 2500,
    });

  const eliteAuthorisationToken = result.body.token;
  const userDetailsResult = await superagent
    .get(url.resolve(`${config.elite2.url}`, 'users/me'))
    .set('Authorization', `Bearer ${generateApiGatewayToken()}`)
    .set('Elite-Authorization', eliteAuthorisationToken);

  log.info(`Sign in to Elite 2 for [${username}] successful`);

  return {
    forename: userDetailsResult.body.firstName,
    surname: userDetailsResult.body.lastName,
    eliteAuthorisationToken,
  };
}

function signInFor(username, password) {
  return signIn(username, password);
}

module.exports = function createSignInService() {
  return { signIn: (username, password) => signInFor(username, password) };
};
