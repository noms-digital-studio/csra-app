import db from '../../util/db';

export async function checkThatTheOutcomeDataWasWrittenToDatabase({ id, outcome }) {
  const result = await db.select().table('prisoner_assessments').where('id', Number(id));

  expect(result[0]).to.not.equal(
    undefined,
    `Did not get a result from database for id: ${id}`,
  );
  expect(result[0].outcome).to.eql(outcome);
}

export async function checkThatRiskAssessmentDataWasWrittenToDatabase({ id, riskAssessment }) {
  const result = await db.select()
  .table('prisoner_assessments')
  .where('id', Number(id));

  expect(result[0]).to.not.equal(
    undefined,
    `Did not get a result from database for id: ${id}`,
  );
  expect(JSON.parse(result[0].risk_assessment).viperScore).to.eql(riskAssessment.viperScore);
  expect(JSON.parse(result[0].risk_assessment).outcome).to.eql(riskAssessment.outcome);
  expect(JSON.parse(result[0].risk_assessment).reasons).to.eql(riskAssessment.reasons);
  expect(JSON.parse(result[0].risk_assessment).questions).to.eql(riskAssessment.questions);
}

export async function checkThatHealthAssessmentDataWasWrittenToDatabase({ id, healthAssessment }) {
  const result = await db.select()
    .table('prisoner_assessments')
    .where('id', Number(id));

  expect(result[0]).to.not.equal(
    undefined,
    `Did not get a result from database for id: ${id}`,
  );
  expect(JSON.parse(result[0].health_assessment)).to.eql(healthAssessment);
}

export async function checkThatPrisonerAssessmentDataWasWrittenToDatabase({
  id,
  nomisId,
  forename,
  surname,
  dateOfBirth,
}) {
  const result = await db.select().table('prisoner_assessments').where('id', Number(id));

  expect(result[0]).to.not.equal(
    undefined,
    `Did not get a result from database for id: ${id}`,
  );
  expect(result[0].nomis_id).to.equalIgnoreCase(nomisId);
  expect(result[0].forename).to.equal(forename);
  expect(result[0].surname).to.equal(surname);
  expect(result[0].date_of_birth.toString()).to.contain(dateOfBirth);
  expect(result[0].questions_hash).to.not.equal(undefined, 'expected a questions_hash');
  expect(result[0].created_at).to.not.equal(undefined, 'expected a created_at');
  expect(result[0].updated_at).to.not.equal(undefined, 'expected a created_at');
  expect(result[0].git_version).to.not.equal(undefined, 'expected a git_version');
  expect(result[0].git_date).to.not.equal(undefined, 'expected a git_date');
}
