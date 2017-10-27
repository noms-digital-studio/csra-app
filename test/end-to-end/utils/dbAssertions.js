import Future from 'fibers/future';

import db from '../../util/db';

export function checkThatTheOutcomeDataWasWrittenToDatabase({
  id,
  outcome,
}) {
  return db.select().table('prisoner_assessments').where('id', Number(id)).then((result) => {
    const assessment = result[0];
    expect(assessment).to.not.equal(
      undefined,
      `Did not get a result from database for id: ${id}`,
    );
    expect(assessment.outcome).to.eql(outcome);
  });
}

export function checkThatRiskAssessmentDataWasWrittenToDatabase({
  id,
  riskAssessment,
}) {
  return db.select().table('prisoner_assessments').where('id', Number(id)).then((result) => {
    const assessment = result[0];

    expect(assessment).to.not.equal(
      undefined,
      `Did not get a result from database for id: ${id}`,
    );

    expect(JSON.parse(assessment.risk_assessment)).to.eql(riskAssessment);
  });
}

export function checkThatHealthAssessmentDataWasWrittenToDatabase({
  id,
  healthAssessment,
}) {
  return db.select().table('prisoner_assessments').where('id', Number(id)).then((result) => {
    const assessment = result[0];

    expect(assessment).to.not.equal(
      undefined,
      `Did not get a result from database for id: ${id}`,
    );
    expect(JSON.parse(assessment.health_assessment)).to.eql(healthAssessment);
  });
}

export function checkThatPrisonerAssessmentDataWasWrittenToDatabase({
  id,
  nomisId,
  forename,
  surname,
  dateOfBirth,
}) {
  return db.select().table('prisoner_assessments').where('id', Number(id)).then((result) => {
    const assessment = result[0];
    expect(assessment).to.not.equal(
      undefined,
      `Did not get a result from database for id: ${id}`,
    );
    expect(assessment.nomis_id).to.equalIgnoreCase(nomisId);
    expect(assessment.forename).to.equal(forename);
    expect(assessment.surname).to.equal(surname);
    expect(assessment.date_of_birth.toString()).to.contain(dateOfBirth);
    expect(assessment.questions_hash).to.not.equal(undefined, 'expected a questions_hash');
    expect(assessment.created_at).to.not.equal(undefined, 'expected a created_at');
    expect(assessment.updated_at).to.not.equal(undefined, 'expected a created_at');
    expect(assessment.git_version).to.not.equal(undefined, 'expected a git_version');
    expect(assessment.git_date).to.not.equal(undefined, 'expected a git_date');
  });
}

export const checkThatRiskAssessmentDataWasWrittenToDatabaseSync = (args) => {
  const future = Future.fromPromise(checkThatRiskAssessmentDataWasWrittenToDatabase(args));

  Future.wait(future);

  future.get();
};

export const checkThatTheOutcomeDataWasWrittenToDatabaseSync = (args) => {
  const future = Future.fromPromise(checkThatTheOutcomeDataWasWrittenToDatabase(args));

  Future.wait(future);

  future.get();
};

export const checkThatHealthAssessmentDataWasWrittenToDatabaseSync = (args) => {
  const future = Future.fromPromise(checkThatHealthAssessmentDataWasWrittenToDatabase(args));

  Future.wait(future);

  future.get();
};

export const checkThatPrisonerAssessmentDataWasWrittenToDatabaseSync = (args) => {
  const future = Future.fromPromise(checkThatPrisonerAssessmentDataWasWrittenToDatabase(args));

  Future.wait(future);

  future.get();
};
