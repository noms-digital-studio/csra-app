const uuid = require('uuid/v4');

const { logger: log } = require('./logger');
const { elite2GetRequest } = require('./elite2-api-request');


const decoratePrisoner = prisoner => ({
  bookingId: prisoner.bookingId,
  id: uuid(),
  nomisId: prisoner.offenderNo,
  forename: prisoner.firstName,
  surname: prisoner.lastName,
  dateOfBirth: prisoner.dateOfBirth,
  outcome: null,
  riskAssessmentOutcome: null,
  healthAssessmentOutcome: null,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  receptionDate: prisoner.receptionDate,
});


const prisonersIntake = async ({ authToken }) => {
  try {
    log.info('Retrieving prisoner arrivals');

    const result = await elite2GetRequest({
      authToken, requestPath: 'offender-intake/_/',
    });

    return result.body.map(decoratePrisoner);
  } catch (e) {
    log.error(e);
    return [];
  }
};


module.exports = prisonersIntake;
