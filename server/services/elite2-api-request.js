const superagent = require('superagent');
const url = require('url');

const config = require('../config');
const { generateApiGatewayToken } = require('../jwtUtils');

const elite2GetRequest = ({ authToken, requestPath }) =>
  superagent
    .get(url.resolve(config.elite2.url, requestPath))
    .set('Authorization', `Bearer ${generateApiGatewayToken()}`)
    .set('Elite-Authorization', authToken);

module.exports.elite2GetRequest = elite2GetRequest;

