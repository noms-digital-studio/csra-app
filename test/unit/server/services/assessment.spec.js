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
    viper: 0.12,
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
    viper: 0.45,
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

  describe('validation', () => {
    describe('general validation stuff', () => {
      let error;
      before(() => {
        setup();
        return assessment.record({ some: 'junk' })
          .catch((err) => { error = err; });
      });
      it('returns validation error', () => {
        expect(error).to.be.an('error');
        expect(error).to.have.property('type', 'validation');
      });
      it('doesnt talk to the database', () => {
        expect(fakeDB.insert.callCount).to.eql(0);
      });
    });
    describe('rules', () => {
      function allows(data, label) {
        const payload = Object.assign({}, validRiskAssessment, data);
        it(`allowss ${label || JSON.stringify(data)}`, () =>
          expect(assessment.record(payload)).to.be.fulfilled);
      }
      function doesNotAllow(data, label) {
        const payload = Object.assign({}, validRiskAssessment, data);
        it(`denies ${label || JSON.stringify(data)}`, () =>
          expect(assessment.record(payload))
            .to.be.rejectedWith(Error, /Validation failed/));
      }

      allows({ type: 'risk' });
      allows({ type: 'healthcare' });
      doesNotAllow({ type: 'something-else' });
      doesNotAllow({ type: undefined }, 'missing "type"');

      allows({ outcome: 'single' });
      allows({ outcome: 'shared' });
      allows({ outcome: 'shared-with-conditions' });
      doesNotAllow({ outcome: 'release' });
      doesNotAllow({ outcome: 'shoe' });
      doesNotAllow({ outcome: undefined }, 'missing "outcome"');

      allows({ nomis_id: 'AB123456' });
      allows({ nomis_id: '12345678' });
      allows({ nomis_id: 'R345678' });
      doesNotAllow({ nomis_id: '12434thisisclearlytoolong' });
      doesNotAllow({ nomis_id: undefined }, 'missing "nomis_id"');

      allows({ viper: 0 });
      allows({ viper: 1 });
      allows({ viper: 0.1 });
      allows({ viper: 0.11 });
      allows({ viper: 0.99 });
      allows({ viper: undefined }, 'missing "viper"');
      doesNotAllow({ viper: -1 });
      doesNotAllow({ viper: 1.1 });
      doesNotAllow({ viper: 0.123 });

      allows({ questions: {
        Q1: { question_id: 'Q1', question: 'Whither?', answer: '42' },
      } });
      allows({ questions: {
        Q1: { question_id: 'Q1', question: 'Whither?', answer: '42' },
        Q2: { question_id: 'Q2', question: 'Up?', answer: 'no' },
        Q7: { question_id: 'Q7', question: 'Down?', answer: 'yes' },
      } });
      allows({ questions: {
        Q1: { question_id: 'Q1', question: '??', answer: '42', and: 'even' },
      } }, 'extra data in questions');
      doesNotAllow({ questions: {} }, 'no "questions"');
      doesNotAllow({ questions: undefined }, 'missing "questions"');
      doesNotAllow({ questions: { Q1: {
        question_id: null, question: '??', answer: '42',
      } } }, 'missing question_id in a question');
      doesNotAllow({ questions: { Q1: {
        question_id: 'Q1', question: '??', answer: '',
      } } }, 'missing answer in a question');
      doesNotAllow({ questions: { Q1: {
        question_id: 'Q1', question: '', answer: '42',
      } } }, 'missing question in a question');

      allows({ reasons: [] });
      allows({ reasons: [
        { question_id: 'Q1', reason: 'I felt like it' },
      ] });
      allows({ reasons: [
        { question_id: 'Q1', reason: 'Looked shifty' },
        { question_id: 'Q2', reason: 'I felt like it' },
        { question_id: 'Q7', reason: 'Sounded rather unsure' },
      ] });
      allows({ reasons: [
        { question_id: 'Q1', reason: 'Looked shifty', other: 'stuff' },
      ] }, 'extra data in reasons');
      doesNotAllow({ reasons: undefined }, 'missing "reasons"');
      doesNotAllow({ reasons: [
        { question_id: 'Q1', reason: 'I felt like it' },
        { reason: 'Looked shifty' },
      ] }, 'missing "question_id" in reasons');
      doesNotAllow({ reasons: [
        { reason: 'I felt like it' },
        { question_id: 'Q7', reason: 'Sounded rather unsure' },
      ] }, 'missing "reason" in reasons');
    });
  });

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
      it('sets viper from request',
        () => expect(row.viper).to.eql(0.12));
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
      it('sets viper from request',
        () => expect(row.viper).to.eql(0.45));
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
