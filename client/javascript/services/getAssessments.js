import debugModule from 'debug';
// import Joi from 'joi';
import xhr from 'xhr';
import has from 'ramda/src/has';
import allPass from 'ramda/src/allPass';
import all from 'ramda/src/all';

const debug = debugModule('csra');

const validate = (body) => {
  const hasId = has('id');
  const hasNomisId = has('nomisId');
  const hasForename = has('forename');
  const hasSurname = has('surname');
  const hasDob = has('dateOfBirth');
  const hasRiskAssessmentCompleted = has('riskAssessmentCompleted');
  const hasHealthAssessmentCompleted = has('healthAssessmentCompleted');
  const hasOutcome = has('outcome');
  const validResponse = allPass([
    hasId,
    hasNomisId,
    hasForename,
    hasSurname,
    hasDob,
    hasRiskAssessmentCompleted,
    hasHealthAssessmentCompleted,
    hasOutcome,
  ]);

  if (Array.isArray(body) && all(validResponse, body)) {
    return body;
  }

  debug('Validation failed');

  return null;
};

const getAssessments = (callback) => {
  const target = '/api/assessments';

  debug('get assessments');

  const options = {
    timeout: 3500,
    json: true,
  };

  xhr.get(target, options, (error, resp, body) => {
    debug('get assessments returned %j', error || body);
    if (error || resp.statusCode >= 400) {
      callback(null);
    } else {
      callback(validate(body));
    }
  });
};

export default getAssessments;
