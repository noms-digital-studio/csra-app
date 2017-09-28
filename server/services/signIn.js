import superagent from 'superagent';
import jwt from 'jsonwebtoken';
import url from 'url';

const config = require('../config');
const { viperRestServiceLogger: log } = require('./logger');

function generateApiGatewayToken() {
  const mojDevToken = `${config.elite2.apiGatewayToken}`;
  const milliseconds = Math.round((new Date()).getTime() / 1000);

  const payload = {
    iat: milliseconds,
    token: mojDevToken,
  };

  const privateKey = `${config.elite2.apiGatewayPrivateKey}`;
  const cert = new Buffer(privateKey);
  return jwt.sign(payload, cert, { algorithm: 'ES256' });
}

function signIn(username, password) {
  log.info(`Signing in user: ${username}`);

  return new Promise((resolve, reject) => {
    superagent
      .post(url.resolve(`${config.elite2.url}`, '/users/login'))
      .set('Authorization', `Bearer ${generateApiGatewayToken()}`)
      .send({ username, password })
      .timeout({
        response: 2000,
        deadline: 2500,
      })
      .end((error, res) => {
        try {
          log.info('Sign in to Elite 2 successful');
          const token = res.body.token;
          resolve({ token });
        } catch (exception) {
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
