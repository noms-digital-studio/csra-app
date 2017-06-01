function checkForErrors() {
  return false;
}

function record(db, assessment) {
  const errors = checkForErrors(assessment);
  if (errors) {
    return Promise.reject(errors);
  }
  return db.insert(assessment).into('assessments')
    .then(result => ({ assessmentId: result[0] }));
}

export default function createAssessmentService(db) {
  return { record: assessment => record(db, assessment) };
}
