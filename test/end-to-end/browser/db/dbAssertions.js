import db from '../../../util/db';

const checkThatAssessmentDataWasWrittenToDatabase = ({
  resolve,
  reject,
  nomisId,
  assessmentType = 'risk',
  assessmentId,
  questionData,
  reasons = [],
  sharedText = 'single cell',
}) => {
  db
    .select()
    .table('assessments')
    .where('assessment_id', Number(assessmentId))
    .then((result) => {
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
      expect(result[0].outcome).to.equal(sharedText);
      expect(JSON.parse(result[0].reasons)).to.eql(reasons);
      expect(JSON.parse(result[0].questions)).to.eql(questionData);
      expect(result[0].viper).to.equal(0.35);
      resolve();
    })
    .catch(error => reject(error));
};

export default checkThatAssessmentDataWasWrittenToDatabase;
