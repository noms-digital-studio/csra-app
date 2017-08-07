import Future from 'fibers/future';

import db from '../../util/db';

const checkThatTheOutcomeDataWasWrittenToDatabase = ({
  id,
  outcome,
}) => db.select()
.table('prisoner_assessments')
.where('id', Number(id))
.then((result) => {
  expect(result[0]).to.not.equal(
    undefined,
    `Did not get a result from database for id: ${id}`,
  );
  expect(result[0].outcome).to.eql(outcome);
  return result[0];
});

const checkThatRiskAssessmentDataWasWrittenToDatabase = ({
  id,
  riskAssessment,
}) => db.select()
    .table('prisoner_assessments')
    .where('id', Number(id))
    .then((result) => {
      expect(result[0]).to.not.equal(
        undefined,
        `Did not get a result from database for id: ${id}`,
      );
      expect(JSON.parse(result[0].risk_assessment).viperScore).to.eql(riskAssessment.viperScore);
      expect(JSON.parse(result[0].risk_assessment).outcome).to.eql(riskAssessment.outcome);
      expect(JSON.parse(result[0].risk_assessment).reasons).to.eql(riskAssessment.reasons);
      expect(JSON.parse(result[0].risk_assessment).questions).to.eql(riskAssessment.questions);
      return result[0];
    });

const checkThatHealthAssessmentDataWasWrittenToDatabase = ({
  id,
  healthAssessment,
}) => db.select()
    .table('prisoner_assessments')
    .where('id', Number(id))
    .then((result) => {
      expect(result[0]).to.not.equal(
        undefined,
        `Did not get a result from database for id: ${id}`,
      );
      expect(JSON.parse(result[0].health_assessment)).to.eql(healthAssessment);
      return result[0];
    });

const checkThatPrisonerAssessmentDataWasWrittenToDatabase = ({
  id,
  nomisId,
  forename,
  surname,
  dateOfBirth,
}) => db.select()
    .table('prisoner_assessments')
    .where('id', Number(id))
    .then((result) => {
      expect(result[0]).to.not.equal(
        undefined,
        `Did not get a result from database for id: ${id}`,
      );
      expect(result[0].nomis_id).to.equal(nomisId);
      expect(result[0].forename).to.equal(forename);
      expect(result[0].surname).to.equal(surname);
      expect(result[0].date_of_birth.toString()).to.contain(dateOfBirth);
      expect(result[0].questions_hash).to.not.equal(undefined, 'expected a questions_hash');
      expect(result[0].created_at).to.not.equal(undefined, 'expected a created_at');
      expect(result[0].updated_at).to.not.equal(undefined, 'expected a created_at');
      expect(result[0].git_version).to.not.equal(undefined, 'expected a git_version');
      expect(result[0].git_date).to.not.equal(undefined, 'expected a git_date');

      return result[0];
    });

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
