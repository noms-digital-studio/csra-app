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
    const cert = Buffer.from(privateKey);
    return jwt.sign(payload, cert, { algorithm: 'ES256' });
  },

  extractAuthoritiesFrom: (jwtToken) => {
    if (jwtToken.startsWith('Bearer ')) {
      const token = jwtToken.split(' ')[1];
      return jwt.decode(token).userPrincipal.authorities;
    }

    return jwt.decode(jwtToken).userPrincipal.authorities;
  },
};

