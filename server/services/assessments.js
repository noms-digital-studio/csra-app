const Joi = require('joi');
const path = require('ramda/src/path');

const { databaseLogger, prisonerAssessmentsServiceLogger: log } = require('./logger');
const { decoratePrisonerWithImage } = require('./prisoner-images');
const prisonerIntake = require('./prisoner-intake');

function save(db, appInfo, rawAssessment) {
  log.info(`Saving prisoner assessment for nomisId: ${rawAssessment.nomisId}`);
  let assessmentForValidation = rawAssessment;
  if (rawAssessment.nomisId) {
    assessmentForValidation = {
      ...rawAssessment,
      nomisId: rawAssessment.nomisId.toUpperCase().trim(),
    };
  }

  const schema = Joi.object({
    facialImageId: Joi.number().allow(null).optional(),
    bookingId: Joi.number(),
    nomisId: Joi.string().max(10),
    forename: Joi.string().max(100),
    surname: Joi.string().max(100),
    dateOfBirth: Joi.date().timestamp('unix'),
  });

  const validated = Joi.validate(assessmentForValidation, schema, {
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
      facial_image_id: assessment.facialImageId,
      booking_id: assessment.bookingId,
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

async function list(db, authToken) {
  log.info('Retrieving prisoner assessment summaries from the database');
  const result = await db.select().orderBy('created_at', 'desc').table('prisoner_assessments');
  let assessments = [];

  if (result && result.length > 0) {
    databaseLogger.info(`Found ${result.length} rows of prisoner assessment data`);

    assessments = result.map(row => ({
      bookingId: row.booking_id,
      id: row.id,
      nomisId: row.nomis_id,
      forename: row.forename,
      surname: row.surname,
      dateOfBirth: row.date_of_birth,
      outcome: row.outcome,
      riskAssessmentOutcome: path(['outcome'], JSON.parse(row.risk_assessment)) || null,
      healthAssessmentOutcome: path(['outcome'], JSON.parse(row.health_assessment)) || null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  } else {
    databaseLogger.info('No prisoner assessment data found in database.');
  }

  const prisonersArrivalList = await prisonerIntake({ authToken });

  databaseLogger.info(`Found ${prisonersArrivalList.length} prisoner(s) in Elite2 /prisoner-intake`);

  const mergeAssessmentsListWithPrisonerArrivalList = prisonersArrivalList.reduce((acc, value) => {
    const isInList = acc.find(record => record.bookingId === value.bookingId);
    if (isInList) {
      return acc;
    }
    return [...acc, value];
  }, assessments);

  return mergeAssessmentsListWithPrisonerArrivalList;
}

function updateAssessmentWithRiskAssessment(db, id, riskAssessment) {
  return db
    .from('prisoner_assessments')
    .where('id', '=', id)
    .update({
      updated_at: new Date().toISOString(),
      risk_assessment: JSON.stringify(riskAssessment),
    }).then((result) => {
      if (result[0] === 0) {
        const err = new Error(`Assessment id: ${id} was not found`);
        err.type = 'not-found';
        databaseLogger.error(err);
        throw err;
      }
      databaseLogger.info(`Updated row: ${id} result: ${result}`);
      return result;
    });
}

function saveRiskAssessment(db, id, rawAssessment) {
  log.info(`Saving risk assessment to the database for id: ${id}`);

  const schema = Joi.object({
    name: Joi.string(),
    username: Joi.string(),
    outcome: Joi.string().valid('single cell', 'shared cell', 'shared cell with conditions'),
    viperScore: Joi.number().allow(null).optional()
      .min(0)
      .max(1)
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
    .select()
    .column('risk_assessment')
    .table('prisoner_assessments')
    .where('id', '=', id)
    .then((_result) => {
      if (_result && _result[0] && _result[0].risk_assessment) {
        const err = new Error(`A risk assessment already exists for assessment with id: ${id}`);
        err.type = 'conflict';
        databaseLogger.error(err);
        throw err;
      }
      return updateAssessmentWithRiskAssessment(db, id, riskAssessment);
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

function updateAssessmentWithHealthAssessment(db, id, healthAssessment) {
  return db
    .from('prisoner_assessments')
    .where('id', '=', id)
    .update({
      updated_at: new Date().toISOString(),
      health_assessment: JSON.stringify(healthAssessment),
    }).then((result) => {
      if (result[0] === 0) {
        const err = new Error(`Assessment id: ${id} was not found`);
        err.type = 'not-found';
        databaseLogger.error(err);
        throw err;
      }
      databaseLogger.info(`Updated row: ${id} result: ${result}`);
      return result;
    });
}

function saveHealthAssessment(db, id, rawAssessment) {
  log.info(`Saving health assessment to the database for id: ${id}`);

  const schema = Joi.object({
    name: Joi.string(),
    username: Joi.string(),
    outcome: Joi.string().valid('single cell', 'shared cell', 'shared cell with conditions'),
    viperScore: Joi.number().allow(null).optional(),
    questions: Joi.object()
      .min(1)
      .pattern(/./, Joi.object({
        questionId: Joi.string(),
        question: Joi.string(),
        answer: Joi.string().allow('').optional(),
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
    .select()
    .column('health_assessment')
    .table('prisoner_assessments')
    .where('id', '=', id)
    .then((_result) => {
      if (_result && _result[0] && _result[0].health_assessment) {
        const err = new Error(`A health assessment already exists for assessment with id: ${id}`);
        err.type = 'conflict';
        databaseLogger.error(err);
        throw err;
      }
      return updateAssessmentWithHealthAssessment(db, id, healthAssessment);
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

function assessmentFor(db, id, authToken) {
  log.info(`Retrieving assessment from the database for id: ${id}`);
  return db
    .select()
    .table('prisoner_assessments')
    .where('id', '=', id)
    .then(async (results) => {
      if (results && results[0]) {
        databaseLogger.info(`Found assessment for id: ${id}`);
        const prisoner = [{
          id: results[0].id,
          bookingId: results[0].booking_id,
          createdAt: results[0].created_at,
          updatedAt: results[0].updated_at,
          nomisId: results[0].nomis_id,
          forename: results[0].forename,
          surname: results[0].surname,
          dateOfBirth: results[0].date_of_birth,
          outcome: results[0].outcome,
          facialImageId: results[0].facial_image_id,
          riskAssessment: JSON.parse(results[0].risk_assessment),
          healthAssessment: JSON.parse(results[0].health_assessment),
        }];

        const prisonerWithImage = await decoratePrisonerWithImage({
          authToken,
          prisoner: prisoner[0],
        });

        return prisonerWithImage;
      }
      const err = new Error(`No assessment found for id: ${id}`);
      err.type = 'not-found';
      databaseLogger.error(err);
      throw err;
    });
}

function saveOutcome(db, id, rawRequest) {
  log.info(`Saving outcome to the database for id: ${id}`);

  const schema = Joi.object({
    outcome: Joi.string().valid('single cell', 'shared cell', 'shared cell with conditions'),
  });

  const validated = Joi.validate(rawRequest, schema, {
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

  const request = validated.value;

  return db
    .from('prisoner_assessments')
    .where('id', '=', id)
    .update({
      updated_at: new Date().toISOString(),
      outcome: request.outcome,
    }).then((result) => {
      if (result[0] === 0) {
        const err = new Error(`Assessment id: ${id} was not found`);
        err.type = 'not-found';
        databaseLogger.error(err);
        throw err;
      }
      databaseLogger.info(`Updated row: ${id} result: ${result}`);
      return result;
    });
}

module.exports = function createPrisonerAssessmentService(db, appInfo) {
  return {
    save: assessment => save(db, appInfo, assessment),
    list: authToken => list(db, authToken),
    saveRiskAssessment: (id, riskAssessment) => saveRiskAssessment(db, id, riskAssessment),
    riskAssessmentFor: id => riskAssessmentFor(db, id),
    saveHealthAssessment: (id, healthAssessment) => saveHealthAssessment(db, id, healthAssessment),
    healthAssessmentFor: id => healthAssessmentFor(db, id),
    assessmentFor: (id, authToken) => assessmentFor(db, id, authToken),
    saveOutcome: (id, outcome) => saveOutcome(db, id, outcome),
  };
};
