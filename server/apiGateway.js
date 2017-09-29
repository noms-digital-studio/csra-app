const jwt = require('jsonwebtoken');
const config = require('./config');

module.exports = function generateApiGatewayToken() {
  const mojDevToken = `${config.elite2.apiGatewayToken}`;
  const milliseconds = Math.round((new Date()).getTime() / 1000);

  const payload = {
    iat: milliseconds,
    token: mojDevToken,
  };

  const privateKey = `${config.elite2.apiGatewayPrivateKey}`;
  const cert = new Buffer(privateKey);
  return jwt.sign(payload, cert, { algorithm: 'ES256' });
};
