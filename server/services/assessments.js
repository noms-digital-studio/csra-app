import Joi from 'joi';
import { databaseLogger as log } from './logger';


function save(db, appInfo, rawAssessment) {
  log.info(`Saving prisoner assessment for nomisId: ${rawAssessment.nomisId}`);

  const schema = Joi.object({
    nomisId: Joi.string().max(10).optional(),
    forename: Joi.string().max(100),
    surname: Joi.string().max(100),
    dateOfBirth: Joi.string().max(20),
  });

  const validated = Joi.validate(rawAssessment, schema, {
    abortEarly: false,
    presence: 'required',
  });

  if (validated.error) {
    const err = new Error(`Validation failed: ${validated.error.message}`);
    err.type = 'validation';
    err.details = validated.error.details;
    log.error(err);
    return Promise.reject(err);
  }

  const assessment = validated.value;

  return db
  .insert({
    nomis_id: assessment.nomisId,
    forename: assessment.forename,
    surname: assessment.surname,
    date_of_birth: assessment.dateOfBirth,
    questions_hash: `{ "risk": "${appInfo.getQuestionHash('risk')}", "healthcare": "${appInfo.getQuestionHash('healthcare')}" }`,
    git_version: appInfo.getGitRef(),
    git_date: appInfo.getGitDate(),
  })
  .into('prisoner_assessments')
  .returning('id')
  .then(result => ({ id: result[0] }));
}

function list(db) {
  log.info('Retrieving prisoner assessmnet summaries from the database');
  return db
    .select()
    .table('prisoner_assessments')
    .then((result) => {
      log.info('Result from Db: ', result);
      if (result && result.length > 0) {
        return result.map(row => ({
          id: row.id,
          nomisId: row.nomis_id,
          forename: row.forename,
          surname: row.surname,
          dateOfBirth: row.date_of_birth,
          outcome: row.outcome,
          riskAssessment: !!row.risk_assessment,
          healthAssessment: !!row.health_assessment,
        }));
      }
      return [];
    });
}

export default function createPrisonerAssessmentService(db, appInfo) {
  return {
    save: assessment => save(db, appInfo, assessment),
    list: () => list(db),
  };
}

