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

  const validRiskAssessment = {
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
  };
  const validHealthcareAssessment = {
    nomis_id: 'AQ125676',
    type: 'healthcare',
    outcome: 'shared',
    viper: 0.456,
    questions: {
      Q1: {
        question_id: 'Q1',
        question: 'Feeling healthy?',
        answer: 'No',
      },
    },
    reasons: [
      {
        question_id: 'Q1',
        reason: 'They are not very healthy',
      },
    ],
  };

  describe('recording risk assessment into DB', () => {
    before(() => {
      setup();
      fakeAppInfo.getGitRef.returns('deadbeef');
      fakeAppInfo.getGitDate.returns(new Date('2017-06-02T11:15:00'));
      fakeAppInfo.getQuestionHash.withArgs('risk').returns('fadedface');

      return assessment.record(validRiskAssessment)
        .then((_result) => { result = _result; });
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

      it('sets nomis_id from request',
        () => expect(row.nomis_id).to.eql('AS223213'));
      it('sets type from request',
        () => expect(row.type).to.eql('risk'));
      it('sets outcome from request',
        () => expect(row.outcome).to.eql('single'));
      it('sets questions_hash from app-info',
        () => expect(row.questions_hash).to.eql('fadedface'));
      it('sets git_version from app-info',
        () => expect(row.git_version).to.eql('deadbeef'));
      it('sets git_date from app-info',
        () => expect(row.git_date).to.eql(new Date('2017-06-02T11:15:00')));
      it('sets questions encoded as JSON from request',
        () => expect(JSON.parse(row.questions)).to.eql({
          Q1: {
            question_id: 'Q1',
            question: 'Are you legit?',
            answer: 'Yep',
          },
        }));
      it('sets reasons encoded as JSON from request',
        () => expect(JSON.parse(row.reasons)).to.eql([
          {
            question_id: 'Q1',
            reason: 'They said they were legit',
          },
        ]));
    });
  });

  describe('recording healthcare assessment into DB', () => {
    before(() => {
      setup();
      fakeAppInfo.getGitRef.returns('deadbeef');
      fakeAppInfo.getGitDate.returns(new Date('2017-06-02T11:15:00'));
      fakeAppInfo.getQuestionHash.withArgs('healthcare').returns('cafeace');

      return assessment.record(validHealthcareAssessment)
        .then((_result) => { result = _result; });
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

      it('sets nomis_id from request',
        () => expect(row.nomis_id).to.eql('AQ125676'));
      it('sets type from request',
        () => expect(row.type).to.eql('healthcare'));
      it('sets outcome from request',
        () => expect(row.outcome).to.eql('shared'));
      it('sets questions_hash from app-info',
        () => expect(row.questions_hash).to.eql('cafeace'));
      it('sets git_version from app-info',
        () => expect(row.git_version).to.eql('deadbeef'));
      it('sets git_date from app-info',
        () => expect(row.git_date).to.eql(new Date('2017-06-02T11:15:00')));
      it('sets questions encoded as JSON from request',
        () => expect(JSON.parse(row.questions)).to.eql({
          Q1: {
            question_id: 'Q1',
            question: 'Feeling healthy?',
            answer: 'No',
          },
        }));
      it('sets reasons encoded as JSON from request',
        () => expect(JSON.parse(row.reasons)).to.eql([
          {
            question_id: 'Q1',
            reason: 'They are not very healthy',
          },
        ]));
    });
  });

  describe('database errors', () => {
    beforeEach(() => setup());
    it('passes through the DB error', () => {
      const fakeError = new Error('Connection failed or something');
      fakeDB.returning.rejects(fakeError);

      return expect(assessment.record(validRiskAssessment))
        .to.be.rejectedWith(Error, 'Connection failed or something');
    });
  });
});
