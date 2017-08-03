import Future from 'fibers/future';

import db from '../../util/db';

const checkThatAssessmentDataWasWrittenToDatabase = ({
  nomisId,
  assessmentId,
}) => db.select()
    .table('prisoner_assessments')
    .where('id', Number(assessmentId))
    .then((result) => {
      expect(result[0]).to.not.equal(
        undefined,
        `Did not get a result from database for id: ${assessmentId}`,
      );
      expect(result[0].nomis_id).to.equal(nomisId);
      expect(result[0].questions_hash).to.not.equal(
        undefined,
        'expected a questions_hash',
      );
      expect(result[0].git_version).to.not.equal(
        undefined,
        'expected a git_version',
      );
      expect(result[0].git_date).to.not.equal(undefined, 'expected a git_date');

      return result[0];
    });

export const checkThatAssessmentDataWasWrittenToDatabaseSync = (args) => {
  const future = Future.fromPromise(checkThatAssessmentDataWasWrittenToDatabase(args));

  Future.wait(future);

  future.get();
};

export default checkThatAssessmentDataWasWrittenToDatabase;
