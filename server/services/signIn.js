const superagent = require('superagent');
const url = require('url');
const config = require('../config');
const { generateApiGatewayToken, extractAuthoritiesFrom } = require('../jwtUtils');
const { logger: log } = require('./logger');

const anError = (message, type) => {
  const err = new Error(message);
  err.type = type;
  throw err;
};

async function signIn(username, password) {
  log.info(`Signing in user: [${username}]`);
  try {
    const result = await superagent.post(url.resolve(`${config.elite2.url}`, 'users/login'))
      .set('Authorization', `Bearer ${generateApiGatewayToken()}`)
      .send({
        username,
        password,
      }).timeout({
        response: 11000,
        deadline: 11000,
      });

    const eliteAuthorisationToken = result.body.token;
    const userDetailsResult = await superagent.get(url.resolve(`${config.elite2.url}`, 'users/me'))
      .set('Authorization', `Bearer ${generateApiGatewayToken()}`)
      .set('Elite-Authorization', eliteAuthorisationToken);

    log.info(`Sign in to Elite 2 for [${username}] successful`);

    return {
      forename: userDetailsResult.body.firstName,
      surname: userDetailsResult.body.lastName,
      username: userDetailsResult.body.username,
      email: userDetailsResult.body.email,
      authorities: extractAuthoritiesFrom(eliteAuthorisationToken),
      eliteAuthorisationToken,
    };
  } catch (exception) {
    log.error(`Sign in to Elite 2 failed for [${username}] with exception:`);
    log.error(exception);
    switch (exception.status) {
      case 401: throw anError('Invalid user credentials', 'unauthorised');
      case 403: throw anError('MoJ API gateway rejected the request to the Elite 2 API', 'forbidden');
      default: throw anError('Elite 2 API failure', 'server-error');
    }
  }
}

module.exports = function createSignInService() {
  return { signIn };
};
