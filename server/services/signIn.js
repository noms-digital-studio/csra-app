const superagent = require('superagent');
const url = require('url');
const config = require('../config');
const generateApiGatewayToken = require('../apiGateway');
const { logger: log } = require('./logger');

function signIn(username, password) {
  log.info(`Signing in user: ${username}`);
  return new Promise((resolve, reject) => {
    superagent
      .post(url.resolve(`${config.elite2.url}`, 'users/login'))
      .set('Authorization', `Bearer ${generateApiGatewayToken()}`)
      .send({ username, password })
      .timeout({
        response: 2000,
        deadline: 2500,
      })
      .end((error, res) => {
        try {
          if (error) {
            log.error(`Sign in to Elite 2 failed for [${username}] with error:`);
            log.error(error);
            reject(error);
          }

          const eliteAuthorisationToken = res.body.token;
          superagent.get(url.resolve(`${config.elite2.url}`, 'users/me'))
          .set('Authorization', `Bearer ${generateApiGatewayToken()}`)
          .set('Elite-Authorization', eliteAuthorisationToken)
          .end((error2, res2) => {
            if (error2) {
              log.error(error2);
            }
            log.info(`Sign in to Elite 2 for [${username}] successful`);
            resolve({
              forename: res2.body.firstName,
              surname: res2.body.lastName,
              eliteAuthorisationToken });
          });
        } catch (exception) {
          log.error(`Sign in to Elite 2 failed for [${username}] with exception:`);
          log.error(exception);
          reject(exception);
        }
      });
  });
}

function signInFor(username, password) {
  return signIn(username, password);
}

module.exports = function createSignInService() {
  return { signIn: (username, password) => signInFor(username, password) };
};
