import Future from 'fibers/future';

import db from '../../util/db';

const clearPrisonerAssessments = () => db.delete().table('prisoner_assessments');

export const clearPrisonerAssessmentsSync = () => {
  const future = Future.fromPromise(clearPrisonerAssessments());

  Future.wait(future);

  future.get();
};

export default clearPrisonerAssessments;
