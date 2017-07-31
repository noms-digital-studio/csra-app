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
          riskAssessmentCompleted: !!row.risk_assessment,
          healthAssessmentCompleted: !!row.health_assessment,
        }));
      }
      databaseLogger.info('No prisoner assessment data found in database.');
      return [];
    });
}

function saveRiskAssessment(db, id, rawAssessment) {
  log.info(`Saving risk assessment to the database for id: ${id}`);

  const schema = Joi.object({
    outcome: Joi.string().valid('single cell', 'shared cell', 'shared cell with conditions'),
    viperScore: Joi.number().optional()
    .min(-1).max(1)
    .precision(2)
    .strict(),
    questions: Joi.object()
    .min(1)
    .pattern(/./, Joi.object({
      questionId: Joi.string(),
      question: Joi.string(),
      answer: Joi.string().allow('').optional(),
    }).unknown()),
    reasons: Joi.array().items(Joi.object({
      questionId: Joi.string(),
      reason: Joi.string(),
    }).unknown()),
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

  const riskAssessment = validated.value;

  return db
    .from('prisoner_assessments')
    .where('id', '=', id)
    .update({
      risk_assessment: JSON.stringify(riskAssessment),
    })
    .then((result) => {
      if (result[0] === 0) {
        const err = new Error(`Assessment id: ${id} was not found}`);
        err.type = 'not-found';
        databaseLogger.error(err);
        throw err;
      }
      databaseLogger.info(`Updated row: ${id} result: ${result}`);
      return result;
    });
}

function riskAssessmentFor(db, id) {
  log.info(`Retrieving risk assessment from the database for id: ${id}`);
  return db
    .select()
    .column('risk_assessment')
    .table('prisoner_assessments')
    .where('id', '=', id)
    .then((_result) => {
      if (_result && _result[0] && _result[0].risk_assessment) {
        databaseLogger.info(`Found risk assessment for id: ${id}`);
        return _result[0].risk_assessment;
      }
      const err = new Error(`No risk assessment found for id: ${id}`);
      err.type = 'not-found';
      databaseLogger.error(err);
      throw err;
    });
}

function saveHealthAssessment(db, id, rawAssessment) {
  log.info(`Saving health assessment to the database for id: ${id}`);

  const schema = Joi.object({
    outcome: Joi.string().valid('single cell', 'shared cell', 'shared cell with conditions'),
    questions: Joi.object()
    .min(1)
    .pattern(/./, Joi.object({
      questionId: Joi.string(),
      question: Joi.string(),
      answer: Joi.string().allow('').optional(),
    }).unknown()),
    reasons: Joi.array().items(Joi.object({
      questionId: Joi.string(),
      reason: Joi.string(),
    }).unknown()),
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

  const healthAssessment = validated.value;

  return db
  .from('prisoner_assessments')
  .where('id', '=', id)
  .update({
    health_assessment: JSON.stringify(healthAssessment),
  })
  .then((result) => {
    if (result[0] === 0) {
      const err = new Error(`Assessment id: ${id} was not found}`);
      err.type = 'not-found';
      databaseLogger.error(err);
      throw err;
    }
    databaseLogger.info(`Updated row: ${id} result: ${result}`);
    return result;
  });
}

function healthAssessmentFor(db, id) {
  log.info(`Retrieving health assessment from the database for id: ${id}`);
  return db
  .select()
  .column('health_assessment')
  .table('prisoner_assessments')
  .where('id', '=', id)
  .then((_result) => {
    if (_result && _result[0] && _result[0].health_assessment) {
      databaseLogger.info(`Found health assessment for id: ${id}`);
      return _result[0].health_assessment;
    }
    const err = new Error(`No health assessment found for id: ${id}`);
    err.type = 'not-found';
    databaseLogger.error(err);
    throw err;
  });
}

export default function createPrisonerAssessmentService(db, appInfo) {
  return {
    save: assessment => save(db, appInfo, assessment),
    list: () => list(db),
    saveRiskAssessment: (id, riskAssessment) => saveRiskAssessment(db, id, riskAssessment),
    riskAssessmentFor: id => riskAssessmentFor(db, id),
    saveHealthAssessment: (id, healthAssessment) => saveHealthAssessment(db, id, healthAssessment),
    healthAssessmentFor: id => healthAssessmentFor(db, id),
  };
}

