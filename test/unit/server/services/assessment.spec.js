import sinon from 'sinon';

import createAssessmentService from '../../../../server/services/assessment';

describe('assessment service', () => {
  let fakeDB;
  let fakeAppInfo;
  let assessment;
  let result;

  function setup() {
    fakeDB = { raw: x => x };
    fakeDB.insert = sinon.stub().returns(fakeDB);
    fakeDB.into = sinon.stub().returns(fakeDB);
    fakeDB.returning = sinon.stub().resolves([8979]);

    fakeAppInfo = {
      getGitRef: sinon.stub(),
      getGitDate: sinon.stub(),
      getQuestionHash: sinon.stub(),
    };

    assessment = createAssessmentService(fakeDB, fakeAppInfo);
  }

  describe('risk', () => {
    describe('validation', () => {
      it('should have some and be tested');
    });

    describe('recording assessment into DB', () => {
      before(() => {
        setup();
        fakeAppInfo.getGitRef.returns('deadbeef');
        fakeAppInfo.getGitDate.returns(new Date('2017-06-02T11:15:00'));
        fakeAppInfo.getQuestionHash.withArgs('risk').returns('fadedface');

        return assessment.record({
          nomis_id: 'AS223213',
          type: 'risk',
          outcome: 'single',
          viper: 0.123,
          questions: {
            Q1: {
              question_id: 'Q1',
              question: 'Are you legit?',
              answer: 'Yep',
            },
          },
          reasons: [
            {
              question_id: 'Q1',
              reason: 'They said they were legit',
            },
          ],
        }).then((_result) => {
          result = _result;
        });
      });

      it('inserts into the `assessments` table in the DB', () => {
        expect(fakeDB.insert.callCount).to.eql(1);
        expect(fakeDB.into.callCount).to.eql(1);
        expect(fakeDB.into.lastCall.args[0]).to.eql('assessments');
        expect(fakeDB.returning.callCount).to.eql(1);
        expect(fakeDB.returning.lastCall.args[0]).to.eql('assessment_id');
      });
      it('resolves with the new ID', () => {
        expect(result.assessment_id).to.eql(8979);
      });
      describe('inserted record', () => {
        let row;
        before(() => { row = fakeDB.insert.lastCall.args[0]; });

        it('should set nomis_id from request',
          () => expect(row.nomis_id).to.eql('AS223213'));
        it('should set type from request',
          () => expect(row.type).to.eql('risk'));
        it('should set outcome from request',
          () => expect(row.outcome).to.eql('single'));
        it('should set questions_hash from app-info',
          () => expect(row.questions_hash).to.eql('fadedface'));
        it('should set git_version from app-info',
          () => expect(row.git_version).to.eql('deadbeef'));
        it('should set git_date from app-info',
          () => expect(row.git_date).to.eql(new Date('2017-06-02T11:15:00')));
        it('should set questions encoded as JSON from request',
          () => expect(JSON.parse(row.questions)).to.eql({
            Q1: {
              question_id: 'Q1',
              question: 'Are you legit?',
              answer: 'Yep',
            },
          }));
        it('should set reasons encoded as JSON from request',
          () => expect(JSON.parse(row.reasons)).to.eql([
            {
              question_id: 'Q1',
              reason: 'They said they were legit',
            },
          ]));
      });
    });
  });
});
