const { logger: log } = require('./logger');

const { elite2GetRequest } = require('./elite2-api-request');

const decoratePrisonerWithImage = async (authToken, prisoner) => {
  if (!prisoner.facialImageId) return { ...prisoner, image: null };
  log.info(`Retrieving image for prisoner ${prisoner.nomisId}`);

  try {
    const result = await elite2GetRequest({
      authToken,
      requestPath: `images/${prisoner.facialImageId}/data`,
    }).responseType('blob');

    const buffer = new Buffer(result.body);
    const bufferBase64 = buffer.toString('base64');
    const base64Img = `data:image/jpeg;base64,${bufferBase64}`;

    log.info(`Found image for prisoner ${prisoner.nomisId}`);

    return { ...prisoner, image: base64Img };
  } catch (exception) {
    log.error(exception);
    return { ...prisoner, image: null };
  }
};

const decoratePrisonersWithImages = async (authToken, prisoners = []) => {
  const promiseList = prisoners
                        .map(async prisoner => decoratePrisonerWithImage({ authToken, prisoner }));

  return Promise.all(promiseList);
};


module.exports = {
  decoratePrisonerWithImage,
  decoratePrisonersWithImages,
};
