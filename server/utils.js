const superagent = require('superagent');
const url = require('url');
const config = require('./config');
const { generateApiGatewayToken } = require('./jwtUtils');
const { logger: log } = require('./services/logger');


const decoratePrisonersWithImages = async (authToken, prisoners) => {
  const promiseList = prisoners.map(async (prisoner) => {
    if (!prisoner.facialImageId) return { ...prisoner, image: null };
    log.info(`Retrieving image for prisoner ${prisoner.nomisId}`);

    try {
      const result = await superagent
                          .get(url.resolve(`${config.elite2.url}`, `images/${prisoner.facialImageId}/data`))
                          .set('Authorization', `Bearer ${generateApiGatewayToken()}`)
                          .set('Elite-Authorization', authToken)
                          .responseType('blob');

      const buffer = new Buffer(result.body);
      const bufferBase64 = buffer.toString('base64');
      const base64Img = `data:image/jpeg;base64,${bufferBase64}`;

      log.info(`Found image for prisoner ${prisoner.nomisId}`);

      return { ...prisoner, image: base64Img };
    } catch (exception) {
      log.error(exception);
      return { ...prisoner, image: null };
    }
  });

  return Promise.all(promiseList);
};


module.exports = {
  decoratePrisonersWithImages,
};
