import db from '../../util/db';

async function clearPrisonerAssessments() {
  await db.delete().table('prisoner_assessments');
}

export default clearPrisonerAssessments;
