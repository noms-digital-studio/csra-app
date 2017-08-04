import debugModule from 'debug';
import Joi from 'joi';
import xhr from 'xhr';

const debug = debugModule('csra');

const schema = Joi.array().items(
  Joi.object({
    id: Joi.number(),
    nomisId: Joi.string().optional(),
    forename: Joi.string(),
    surname: Joi.string(),
    dateOfBirth: Joi.string(),
    riskAssessmentCompleted: Joi.boolean(),
    healthAssessmentCompleted: Joi.boolean(),
    outcome: Joi.string().allow(null),
  }),
);

const validate = (assessment) => {
  const isValid = Joi.validate(assessment, schema, {
    abortEarly: false,
    presence: 'required',
  });

  debug('Validation of get assessments return %j', isValid.error);

  return isValid.error === null;
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
      callback(validate(body) ? body : null);
    }
  });
};

export default getAssessments;
