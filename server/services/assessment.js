function checkForErrors() {
  return false;
}

function record(db, appInfo, assessment) {
  const errors = checkForErrors(assessment);
  if (errors) {
    return Promise.reject(errors);
  }
  return db
    .insert({
      nomis_id: assessment.nomis_id,
      type: assessment.type,
      outcome: assessment.outcome,
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
