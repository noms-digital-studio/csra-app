import db from '../../util/db';

export async function checkThatTheOutcomeDataWasWrittenToDatabase({ id, outcome }) {
  const dbResult = await db.select()
    .table('prisoner_assessments')
    .where('id', Number(id));
  const result = dbResult[0];

  expect(result).to.not.equal(
    undefined,
    `Did not get a result from database for id: ${id}`,
  );
  expect(result.outcome).to.eql(outcome);
}

export async function checkThatRiskAssessmentDataWasWrittenToDatabase({ id, riskAssessment }) {
  const dbResult = await db.select()
  .table('prisoner_assessments')
  .where('id', Number(id));
  const result = dbResult[0];

  expect(result).to.not.equal(
    undefined,
    `Did not get a result from database for id: ${id}`,
  );
  expect(JSON.parse(result.risk_assessment)).to.eql(riskAssessment);
}

export async function checkThatHealthAssessmentDataWasWrittenToDatabase({ id, healthAssessment }) {
  const dbResult = await db.select()
    .table('prisoner_assessments')
    .where('id', Number(id));
  const result = dbResult[0];

  expect(result).to.not.equal(
    undefined,
    `Did not get a result from database for id: ${id}`,
  );
  expect(JSON.parse(result.health_assessment)).to.eql(healthAssessment);
}

export async function checkThatPrisonerAssessmentDataWasWrittenToDatabase({
  id,
  nomisId,
  forename,
  surname,
  dateOfBirth,
}) {
  const dbResult = await db.select()
    .table('prisoner_assessments')
    .where('id', Number(id));
  const result = dbResult[0];

  expect(result).to.not.equal(
    undefined,
    `Did not get a result from database for id: ${id}`,
  );
  expect(result.nomis_id).to.equalIgnoreCase(nomisId);
  expect(result.forename).to.equal(forename);
  expect(result.surname).to.equal(surname);
  expect(result.date_of_birth.toString()).to.contain(dateOfBirth);
  expect(result.questions_hash).to.not.equal(undefined, 'expected a questions_hash');
  expect(result.created_at).to.not.equal(undefined, 'expected a created_at');
  expect(result.updated_at).to.not.equal(undefined, 'expected a created_at');
  expect(result.git_version).to.not.equal(undefined, 'expected a git_version');
  expect(result.git_date).to.not.equal(undefined, 'expected a git_date');
}
