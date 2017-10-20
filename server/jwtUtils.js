const jwt = require('jsonwebtoken');
const config = require('./config');

module.exports = {
  generateApiGatewayToken: () => {
    const mojDevToken = `${config.elite2.apiGatewayToken}`;
    const milliseconds = Math.round((new Date()).getTime() / 1000);

    const payload = {
      iat: milliseconds,
      token: mojDevToken,
    };

    const privateKey = `${config.elite2.apiGatewayPrivateKey}`;
    const cert = new Buffer(privateKey);
    return jwt.sign(payload, cert, { algorithm: 'ES256' });
  },

  extractAuthoritiesFrom: (jwtToken) => {
    const token = jwtToken.split(' ')[1];
    const decodedToken = jwt.decode(token);
    return decodedToken.userPrincipal.authorities;
  },
};

