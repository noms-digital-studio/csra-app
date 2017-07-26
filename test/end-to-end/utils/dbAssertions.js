import Future from 'fibers/future';

import db from '../../util/db';

const checkThatAssessmentDataWasWrittenToDatabase = ({
  nomisId,
  assessmentType = 'risk',
  assessmentId,
  questionData,
  reasons = [],
  assessmentOutcome = 'single cell',
  viperScore = -1,
}) =>
  db
    .select()
    .table('assessments')
    .where('assessment_id', Number(assessmentId))
    .then((result) => {
      expect(result[0]).to.not.equal(
        undefined,
        `Did not get a result from database for assessmentId: ${assessmentId}`,
      );
      expect(result[0].nomis_id).to.equal(nomisId);
      expect(result[0].timestamp).to.not.be.equal(
        undefined,
        'expected a timestamp',
      );
      expect(result[0].questions_hash).to.not.equal(
        undefined,
        'expected a questions_hash',
      );
      expect(result[0].git_version).to.not.equal(
        undefined,
        'expected a git_version',
      );
      expect(result[0].git_date).to.not.equal(undefined, 'expected a git_date');
      expect(result[0].type).to.equal(assessmentType);
      expect(result[0].outcome).to.equal(assessmentOutcome);
      expect(JSON.parse(result[0].reasons)).to.eql(reasons);
      expect(JSON.parse(result[0].questions)).to.eql(questionData);
      expect(result[0].viper).to.equal(viperScore);

      return result[0];
    });

export const checkThatAssessmentDataWasWrittenToDatabaseSync = (args) => {
  const future = Future.fromPromise(checkThatAssessmentDataWasWrittenToDatabase(args));

  Future.wait(future);

  future.get();
};

export default checkThatAssessmentDataWasWrittenToDatabase;
