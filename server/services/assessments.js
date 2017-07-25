import Joi from 'joi';
import { databaseLogger, prisonerAssessmentsServiceLogger as log } from './logger';


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
  databaseLogger.info(`Inserting prisoner assessment data into database for NomisId: ${assessment.nomisId}`);
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
  log.info('Retrieving prisoner assessment summaries from the database');
  return db
    .select()
    .table('prisoner_assessments')
    .then((result) => {
      if (result && result.length > 0) {
        databaseLogger.info(`Found ${result.length} rows of prisoner assessment data`);
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
      databaseLogger.info('No prisoner assessment data found in database.');
      return [];
    });
}

export default function createPrisonerAssessmentService(db, appInfo) {
  return {
    save: assessment => save(db, appInfo, assessment),
    list: () => list(db),
  };
}

