import Joi from 'joi';

const schema = Joi.object({
  type: Joi.string().valid('risk', 'healthcare'),
  outcome: Joi.string().valid('single', 'shared', 'shared-with-conditions'),
  nomis_id: Joi.string().max(10),
  viper: Joi.number().optional()
    .min(0).max(1)
    .precision(2)
    .strict(),
  questions: Joi.object()
    .min(1)
    .pattern(/./, Joi.object({
      question_id: Joi.string(),
      question: Joi.string(),
      answer: Joi.string(),
    }).unknown()),
  reasons: Joi.array().items(Joi.object({
    question_id: Joi.string(),
    reason: Joi.string(),
  }).unknown()),
});

function record(db, appInfo, rawAssessment) {
  const validated = Joi.validate(rawAssessment, schema, {
    abortEarly: false,
    presence: 'required',
  });

  if (validated.error) {
    const err = new Error(`Validation failed: ${validated.error.message}`);
    err.type = 'validation';
    err.details = validated.error.details;
    return Promise.reject(err);
  }

  const assessment = validated.value;

  return db
    .insert({
      nomis_id: assessment.nomis_id,
      type: assessment.type,
      outcome: assessment.outcome,
      viper: assessment.viper,
      questions_hash: appInfo.getQuestionHash(assessment.type),
      git_version: appInfo.getGitRef(),
      git_date: appInfo.getGitDate(),
      questions: JSON.stringify(assessment.questions),
      reasons: JSON.stringify(assessment.reasons),
    })
    .into('assessments')
    .returning('assessment_id')
    .then(result => ({ assessment_id: result[0] }));
}

export default function createAssessmentService(db, appInfo) {
  return { record: assessment => record(db, appInfo, assessment) };
}
