import db from '../../../util/db';

function checkLowRiskValuesWhereWrittenToDatabase(resolve, assessmentId, questionData, reasons, sharedText) {
  db.select().table('assessments').where('assessment_id', Number(assessmentId)).then(
    (result) => {
      expect(result[0].nomis_id).to.equal('J1234LO');
      expect(result[0].timestamp).to.not.equal(undefined, 'expected a timestamp');
      expect(result[0].questions_hash).to.not.equal(undefined, 'expected a questions_hash');
      expect(result[0].git_version).to.not.equal(undefined, 'expected a git_version');
      expect(result[0].git_date).to.not.equal(undefined, 'expected a git_date');
      expect(result[0].type).to.equal('risk');
      expect(result[0].outcome).to.equal(sharedText || 'single cell');
      expect(result[0].reasons).to.equal(reasons || '[]');
      console.log('thing1: ', result[0].questions);
      console.log('thing2: ', questionData);
      expect(JSON.parse(result[0].questions)).to.eql(questionData);
      expect(result[0].viper).to.equal(0.35);
      resolve();
    });

}

export default checkLowRiskValuesWhereWrittenToDatabase;
