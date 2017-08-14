import createPrisonerAssessmentService from '../../../../server/services/assessments';

describe('prisoner assessment service', () => {
  const validPrisonerAssessment = {
    nomisId: ' j1234LO ',
    forename: 'John',
    surname: 'Lowe',
    dateOfBirth: 599529600,
  };

  const validRiskAssessment = {
    outcome: 'shared cell',
    viperScore: 0.35,
    questions: {
      Q1: {
        questionId: 'Q1',
        question: 'Are you legit?',
        answer: 'Yes',
      },
    },
    reasons: [
      {
        questionId: 'Q1',
        reason: 'They said they were legit',
      },
    ],
  };

  const validHealthAssessment = {
    outcome: 'single cell',
    viperScore: null,
    questions: {
      Q1: {
        questionId: 'Q1',
        question: 'Are you legit?',
        answer: 'Yes',
      },
    },
  };

  const fakeAppInfo = {
    getGitRef: sinon.stub(),
    getGitDate: sinon.stub(),
    getQuestionHash: sinon.stub(),
  };
  let fakeDB;
  let prisonerAssessmentService;
  let result;

  describe('records prisoner assessments to the DB', () => {
    function setup() {
      fakeDB = { raw: x => x };
      fakeDB.insert = sinon.stub().returns(fakeDB);
      fakeDB.into = sinon.stub().returns(fakeDB);
      fakeDB.returning = sinon.stub().resolves([123]);
      prisonerAssessmentService = createPrisonerAssessmentService(fakeDB, fakeAppInfo);
    }

    before(() => {
      setup();
      fakeAppInfo.getGitRef.returns('gifref');
      fakeAppInfo.getGitDate.returns(new Date('2017-06-02T11:15:00'));
      fakeAppInfo.getQuestionHash.withArgs('risk').returns('foo');
      fakeAppInfo.getQuestionHash.withArgs('healthcare').returns('bar');

      return prisonerAssessmentService.save(validPrisonerAssessment)
      .then((_result) => { result = _result; });
    });

    it('inserts into the `prisoner_assessments` table in the DB', () => {
      expect(fakeDB.insert.callCount).to.eql(1);
      expect(fakeDB.into.callCount).to.eql(1);
      expect(fakeDB.into.lastCall.args[0]).to.eql('prisoner_assessments');
      expect(fakeDB.returning.callCount).to.eql(1);
      expect(fakeDB.returning.lastCall.args[0]).to.eql('id');
    });

    it('resolves with the new ID', () => {
      expect(result.id).to.eql(123);
    });

    describe('inserted record', () => {
      let row;
      before(() => {
        row = fakeDB.insert.lastCall.args[0];
      });
      it('sets nomisId from request', () => expect(row.nomis_id).to.equal('J1234LO'));
      it('sets forename from request', () => expect(row.forename).to.equal('John'));
      it('sets suname from request', () => expect(row.surname).to.equal('Lowe'));
      it('sets dob from request', () => expect(row.date_of_birth.toString()).to.contains('Sat Dec 31 1988'));
      it('sets questions_hash from app-info', () => expect(row.questions_hash).to.equal('{ "risk": "foo", "healthcare": "bar" }'));
      it('sets git_version from app-info', () => expect(row.git_version).to.equal('gifref'));
      it('sets git_date from app-info', () => expect(row.git_date).to.eql(new Date('2017-06-02T11:15:00')));
    });

    describe('general validation stuff', () => {
      let error;
      before(() => {
        setup();
        return prisonerAssessmentService.save({ some: 'junk' })
        .catch((err) => { error = err; });
      });

      it('returns validation error', () => {
        expect(error).to.be.an('error');
        expect(error).to.have.property('type', 'validation');
      });

      it('does not talk to the database when validation fails', () => {
        expect(fakeDB.insert.callCount).to.eql(0);
      });
    });

    describe('rules', () => {
      function allows(data, label) {
        const payload = Object.assign({}, validPrisonerAssessment, data);
        it(`allows ${label || JSON.stringify(data)}`, () =>
          expect(prisonerAssessmentService.save(payload)).to.be.fulfilled);
      }

      function doesNotAllow(data, label) {
        const payload = Object.assign({}, validPrisonerAssessment, data);
        it(`denies ${label || JSON.stringify(data)}`, () =>
          expect(prisonerAssessmentService.save(payload))
          .to.be.rejectedWith(Error, /Validation failed/));
      }

      allows({ nomisId: 'J1234LO' });
      allows({ nomisId: '1234567890' });
      allows({ nomisId: undefined }, 'missing "nomisId"');
      doesNotAllow({ nomisId: '12434thisisclearlytoolong' });

      allows({ forename: 'John' });
      doesNotAllow({ forename: undefined }, 'missing "forename"');
      doesNotAllow({ forename: new Array(101 + 1).join('A') });

      allows({ surname: 'John' });
      doesNotAllow({ surname: undefined }, 'missing "surname"');
      doesNotAllow({ surname: new Array(101 + 1).join('A') });

      allows({ dateOfBirth: 599529600 });
      doesNotAllow({ dateOfBirth: undefined }, 'missing "surname"');
      doesNotAllow({ dateOfBirth: new Array(21 + 1).join('A') });
    });
  });

  describe('retrieves a list of prisoner assessment summaries', () => {
    before(() => {
      fakeDB = { raw: x => x };
      fakeDB.select = sinon.stub().returns(fakeDB);
      prisonerAssessmentService = createPrisonerAssessmentService(fakeDB, fakeAppInfo);
    });

    it('returns the prisoner assessment summaries', () => {
      fakeDB.table = sinon.stub().resolves(
        [{
          id: 123,
          nomis_id: 'J1234LO',
          forename: 'John',
          surname: 'Lowe',
          date_of_birth: -77932800,
          outcome: null,
          risk_assessment: '{"data": "value"}',
          health_assessment: null,
        },
        {
          id: 567,
          nomis_id: 'R1234MO',
          forename: 'Richard',
          surname: 'Moyen',
          date_of_birth: 599529600,
          outcome: 'Shared Cell',
          risk_assessment: '{"data": "value"}',
          health_assessment: '{"data": "value"}',
        }],
      );
      return prisonerAssessmentService.list()
      .then((listResult) => {
        expect(fakeDB.table.lastCall.args[0]).to.eql('prisoner_assessments');
        expect(listResult).to.eql([{
          id: 123,
          nomisId: 'J1234LO',
          forename: 'John',
          surname: 'Lowe',
          dateOfBirth: -77932800,
          outcome: null,
          riskAssessmentCompleted: true,
          healthAssessmentCompleted: false,
        },
        {
          id: 567,
          nomisId: 'R1234MO',
          forename: 'Richard',
          surname: 'Moyen',
          dateOfBirth: 599529600,
          outcome: 'Shared Cell',
          riskAssessmentCompleted: true,
          healthAssessmentCompleted: true,
        }]);
      });
    });

    it('returns an empty list when the Db is empty', () => {
      fakeDB.table = sinon.stub().resolves([]);
      return prisonerAssessmentService.list()
      .then((listResult) => {
        expect(fakeDB.table.lastCall.args[0]).to.eql('prisoner_assessments');
        expect(listResult).to.eql([]);
      });
    });
  });

  describe('records risk assessment', () => {
    function setup() {
      fakeDB = { raw: x => x };
      fakeDB.select = sinon.stub().returns(fakeDB);
      fakeDB.column = sinon.stub().returns(fakeDB);
      fakeDB.table = sinon.stub().returns(fakeDB);
      fakeDB.where = sinon.stub().onFirstCall()
        .resolves([])
        .onSecondCall()
        .returns(fakeDB);

      fakeDB.from = sinon.stub().returns(fakeDB);
      fakeDB.update = sinon.stub().resolves([1]);
      prisonerAssessmentService = createPrisonerAssessmentService(fakeDB, fakeAppInfo);
    }

    describe('happy path', () => {
      before(() => {
        setup();
        prisonerAssessmentService.saveRiskAssessment(123, validRiskAssessment)
        .then((_result) => { result = _result; });
      });

      it('updates the prisoner assessments record with the risk assessment', () => {
        expect(fakeDB.from.callCount).to.eql(1);
        expect(fakeDB.where.callCount).to.eql(2);
        expect(fakeDB.update.callCount).to.eql(1);
        expect(fakeDB.from.lastCall.args[0]).to.eql('prisoner_assessments');
        expect(fakeDB.where.lastCall.args[0]).to.eql('id');
        expect(fakeDB.where.lastCall.args[1]).to.eql('=');
        expect(fakeDB.where.lastCall.args[2]).to.eql(123);
        expect(fakeDB.update.lastCall.args[0].risk_assessment).to
          .eql(JSON.stringify(validRiskAssessment));
        expect(fakeDB.update.lastCall.args[0].updated_at).is.not.equal(undefined);
        expect(result).to.eql([1]);
      });
    });

    describe('unhappy path', () => {
      beforeEach(() => {
        fakeDB = { raw: x => x };
        fakeDB.select = sinon.stub().returns(fakeDB);
        fakeDB.column = sinon.stub().returns(fakeDB);
        fakeDB.table = sinon.stub().returns(fakeDB);
        fakeDB.where = sinon.stub().onFirstCall()
        .resolves([])
        .onSecondCall()
        .returns(fakeDB);

        fakeDB.from = sinon.stub().returns(fakeDB);
        prisonerAssessmentService = createPrisonerAssessmentService(fakeDB, fakeAppInfo);
      });

      it('returns a `not-found` error  ', () => {
        fakeDB.update = sinon.stub().resolves([0]);

        return expect(prisonerAssessmentService.saveRiskAssessment(999, validRiskAssessment))
        .to.be.rejectedWith(Error, 'Assessment id: 999 was not found');
      });

      it('passes on the db error', () => {
        fakeDB.update = sinon.stub().rejects(new Error('Connection failed or something'));

        return expect(prisonerAssessmentService.saveRiskAssessment(999, validRiskAssessment))
        .to.be.rejectedWith(Error, 'Connection failed or something');
      });
    });

    describe('risk assessment already saved', () => {
      before(() => {
        fakeDB = { raw: x => x };
        fakeDB.select = sinon.stub().returns(fakeDB);
        fakeDB.column = sinon.stub().returns(fakeDB);
        fakeDB.table = sinon.stub().returns(fakeDB);
        fakeDB.where = sinon.stub().resolves([{ risk_assessment: 'some risk data' }]);
        prisonerAssessmentService = createPrisonerAssessmentService(fakeDB, fakeAppInfo);
      });

      it('returns a `conflict` error  ', () => {
        fakeDB.update = sinon.stub().resolves([0]);

        return expect(prisonerAssessmentService.saveRiskAssessment(999, validRiskAssessment))
        .to.be.rejectedWith(Error, 'A risk assessment already exists for assessment with id: 999');
      });
    });

    describe('general validation stuff', () => {
      let error;
      before(() => {
        setup();
        return prisonerAssessmentService.saveRiskAssessment({ some: 'junk' })
        .catch((err) => { error = err; });
      });

      it('returns validation error', () => {
        expect(error).to.be.an('error');
        expect(error).to.have.property('type', 'validation');
      });

      it('does not talk to the database when validation fails', () => {
        expect(fakeDB.update.callCount).to.eql(0);
      });
    });

    describe('rules', () => {
      beforeEach(() => {
        setup();
      });

      function allows(data, label) {
        const payload = Object.assign({}, validRiskAssessment, data);
        it(`allows ${label || JSON.stringify(data)}`, () =>
          expect(prisonerAssessmentService.saveRiskAssessment(123, payload)).to.be.fulfilled);
      }

      function doesNotAllow(data, label) {
        const payload = Object.assign({}, validRiskAssessment, data);
        it(`denies ${label || JSON.stringify(data)}`, () =>
          expect(prisonerAssessmentService.saveRiskAssessment(123, payload))
          .to.be.rejectedWith(Error, /Validation failed/));
      }

      allows({ viperScore: 0 });
      allows({ viperScore: 1 });
      allows({ viperScore: 0.1 });
      allows({ viperScore: 0.11 });
      allows({ viperScore: 0.99 });
      allows({ viperScore: undefined }, 'missing "viperScore"');
      allows({ viperScore: null });
      doesNotAllow({ viperScore: -2 });
      doesNotAllow({ viperScore: 1.1 });
      doesNotAllow({ viperScore: 0.123 });

      allows({ outcome: 'single cell' });
      allows({ outcome: 'shared cell' });
      allows({ outcome: 'shared cell with conditions' });
      doesNotAllow({ outcome: 'release' });
      doesNotAllow({ outcome: 'shoe' });
      doesNotAllow({ outcome: undefined }, 'missing "outcome"');

      allows({ questions: {
        Q1: { questionId: 'Q1', question: 'Whither?', answer: '42' },
      } });
      allows({ questions: {
        Q1: { questionId: 'Q1', question: 'Whither?', answer: '42' },
        Q2: { questionId: 'Q2', question: 'Up?', answer: 'no' },
        Q7: { questionId: 'Q7', question: 'Down?', answer: 'yes' },
      } });
      allows({ questions: {
        Q1: { questionId: 'Q1', question: '??', answer: '42', and: 'even' },
      } }, 'extra data in questions');
      doesNotAllow({ questions: {} }, 'no "questions"');
      doesNotAllow({ questions: undefined }, 'missing "questions"');
      doesNotAllow({ questions: { Q1: {
        question_id: null, question: '??', answer: '42',
      } } }, 'missing question_id in a question');
      doesNotAllow({ questions: { Q1: {
        question_id: 'Q1', question: '', answer: '42',
      } } }, 'missing question in a question');

      allows({ reasons: [] });
      allows({ reasons: [
        { questionId: 'Q1', reason: 'I felt like it' },
      ] });
      allows({ reasons: [
        { questionId: 'Q1', reason: 'Looked shifty' },
        { questionId: 'Q2', reason: 'I felt like it' },
        { questionId: 'Q7', reason: 'Sounded rather unsure' },
      ] });
      allows({ reasons: [
        { questionId: 'Q1', reason: 'Looked shifty', other: 'stuff' },
      ] }, 'extra data in reasons');
      doesNotAllow({ reasons: undefined }, 'missing "reasons"');
      doesNotAllow({ reasons: [
        { questionId: 'Q1', reason: 'I felt like it' },
        { reason: 'Looked shifty' },
      ] }, 'missing "questionId" in reasons');
      doesNotAllow({ reasons: [
        { reason: 'I felt like it' },
        { questionId: 'Q7', reason: 'Sounded rather unsure' },
      ] }, 'missing "reason" in reasons');
    });
  });

  describe('retrieves a risk assessment', () => {
    before(() => {
      fakeDB = { raw: x => x };
      fakeDB.select = sinon.stub().returns(fakeDB);
      fakeDB.column = sinon.stub().returns(fakeDB);
      fakeDB.table = sinon.stub().returns(fakeDB);
      prisonerAssessmentService = createPrisonerAssessmentService(fakeDB, fakeAppInfo);
    });

    it('returns the risk assessment', () => {
      fakeDB.where = sinon.stub().resolves([{ risk_assessment: validRiskAssessment }]);

      return prisonerAssessmentService.riskAssessmentFor(123)
      .then((riskResult) => {
        expect(fakeDB.select.callCount).to.eql(1);
        expect(fakeDB.column.callCount).to.eql(1);
        expect(fakeDB.column.lastCall.args[0]).to.eql('risk_assessment');
        expect(fakeDB.table.callCount).to.eql(1);
        expect(fakeDB.table.lastCall.args[0]).to.eql('prisoner_assessments');
        expect(fakeDB.where.lastCall.args[0]).to.eql('id');
        expect(fakeDB.where.lastCall.args[1]).to.eql('=');
        expect(fakeDB.where.lastCall.args[2]).to.eql(123);
        expect(riskResult).to.eql(validRiskAssessment);
      });
    });

    it('returns a `not-found` error when the prisoner assessment cannot be found', () => {
      fakeDB.where = sinon.stub().resolves();

      return expect(prisonerAssessmentService.riskAssessmentFor(123))
        .to.be.rejectedWith(Error, 'No risk assessment found for id: 123');
    });

    it('returns a `not-found` error when the risk assessment cannot be found', () => {
      fakeDB.where = sinon.stub().resolves([]);

      return expect(prisonerAssessmentService.riskAssessmentFor(123))
        .to.be.rejectedWith(Error, 'No risk assessment found for id: 123');
    });

    it('passes on the db error', () => {
      fakeDB.where = sinon.stub().rejects(new Error('Connection failed or something'));

      return expect(prisonerAssessmentService.riskAssessmentFor(123))
      .to.be.rejectedWith(Error, 'Connection failed or something');
    });
  });

  describe('records health assessment', () => {
    function setup() {
      fakeDB = { raw: x => x };
      fakeDB.select = sinon.stub().returns(fakeDB);
      fakeDB.column = sinon.stub().returns(fakeDB);
      fakeDB.table = sinon.stub().returns(fakeDB);
      fakeDB.where = sinon.stub().onFirstCall()
      .resolves([])
      .onSecondCall()
      .returns(fakeDB);

      fakeDB.from = sinon.stub().returns(fakeDB);
      fakeDB.update = sinon.stub().resolves([1]);
      prisonerAssessmentService = createPrisonerAssessmentService(fakeDB, fakeAppInfo);
    }

    describe('happy path', () => {
      before(() => {
        setup();
        prisonerAssessmentService.saveHealthAssessment(123, validHealthAssessment)
        .then((_result) => { result = _result; });
      });

      it('updates the prisoner assessments record with the health assessment', () => {
        expect(fakeDB.from.callCount).to.eql(1);
        expect(fakeDB.where.callCount).to.eql(2);
        expect(fakeDB.update.callCount).to.eql(1);
        expect(fakeDB.from.lastCall.args[0]).to.eql('prisoner_assessments');
        expect(fakeDB.where.lastCall.args[0]).to.eql('id');
        expect(fakeDB.where.lastCall.args[1]).to.eql('=');
        expect(fakeDB.where.lastCall.args[2]).to.eql(123);
        expect(fakeDB.update.lastCall.args[0].health_assessment).to
        .eql(JSON.stringify(validHealthAssessment));
        expect(fakeDB.update.lastCall.args[0].updated_at).is.not.equal(undefined);
        expect(result).to.eql([1]);
      });
    });

    describe('unhappy path', () => {
      beforeEach(() => {
        fakeDB = { raw: x => x };
        fakeDB.select = sinon.stub().returns(fakeDB);
        fakeDB.column = sinon.stub().returns(fakeDB);
        fakeDB.table = sinon.stub().returns(fakeDB);
        fakeDB.where = sinon.stub().onFirstCall()
        .resolves([])
        .onSecondCall()
        .returns(fakeDB);

        fakeDB.from = sinon.stub().returns(fakeDB);
        prisonerAssessmentService = createPrisonerAssessmentService(fakeDB, fakeAppInfo);
      });

      it('returns a `not-found` error  ', () => {
        fakeDB.update = sinon.stub().resolves([0]);

        return expect(prisonerAssessmentService.saveHealthAssessment(999, validHealthAssessment))
        .to.be.rejectedWith(Error, 'Assessment id: 999 was not found');
      });

      it('passes on the db error', () => {
        fakeDB.update = sinon.stub().rejects(new Error('Connection failed or something'));

        return expect(prisonerAssessmentService.saveHealthAssessment(999, validHealthAssessment))
        .to.be.rejectedWith(Error, 'Connection failed or something');
      });
    });

    describe('health assessment already saved', () => {
      before(() => {
        fakeDB = { raw: x => x };
        fakeDB.select = sinon.stub().returns(fakeDB);
        fakeDB.column = sinon.stub().returns(fakeDB);
        fakeDB.table = sinon.stub().returns(fakeDB);
        fakeDB.where = sinon.stub().resolves([{ health_assessment: 'some health data' }]);
        prisonerAssessmentService = createPrisonerAssessmentService(fakeDB, fakeAppInfo);
      });

      it('returns a `conflict` error  ', () => {
        fakeDB.update = sinon.stub().resolves([0]);

        return expect(prisonerAssessmentService.saveHealthAssessment(999, validHealthAssessment))
        .to.be.rejectedWith(Error, 'A health assessment already exists for assessment with id: 999');
      });
    });


    describe('general validation stuff', () => {
      let error;
      before(() => {
        setup();
        return prisonerAssessmentService.saveHealthAssessment({ some: 'junk' })
        .catch((err) => { error = err; });
      });

      it('returns validation error', () => {
        expect(error).to.be.an('error');
        expect(error).to.have.property('type', 'validation');
      });

      it('does not talk to the database when validation fails', () => {
        expect(fakeDB.update.callCount).to.eql(0);
      });
    });

    describe('rules', () => {
      beforeEach(() => {
        setup();
      });

      function allows(data, label) {
        const payload = Object.assign({}, validHealthAssessment, data);
        it(`allows ${label || JSON.stringify(data)}`, () =>
          expect(prisonerAssessmentService.saveHealthAssessment(123, payload)).to.be.fulfilled);
      }
      function doesNotAllow(data, label) {
        const payload = Object.assign({}, validHealthAssessment, data);
        it(`denies ${label || JSON.stringify(data)}`, () =>
          expect(prisonerAssessmentService.saveHealthAssessment(123, payload))
          .to.be.rejectedWith(Error, /Validation failed/));
      }

      allows({ outcome: 'single cell' });
      allows({ outcome: 'shared cell' });
      allows({ outcome: 'shared cell with conditions' });
      doesNotAllow({ outcome: 'release' });
      doesNotAllow({ outcome: 'shoe' });
      doesNotAllow({ outcome: undefined }, 'missing "outcome"');

      allows({ questions: {
        Q1: { questionId: 'Q1', question: 'Whither?', answer: '42' },
      } });
      allows({ questions: {
        Q1: { questionId: 'Q1', question: 'Whither?', answer: '42' },
        Q2: { questionId: 'Q2', question: 'Up?', answer: 'no' },
        Q7: { questionId: 'Q7', question: 'Down?', answer: 'yes' },
      } });
      allows({ questions: {
        Q1: { questionId: 'Q1', question: '??', answer: '42', and: 'even' },
      } }, 'extra data in questions');
      doesNotAllow({ questions: {} }, 'no "questions"');
      doesNotAllow({ questions: undefined }, 'missing "questions"');
      doesNotAllow({ questions: { Q1: {
        question_id: null, question: '??', answer: '42',
      } } }, 'missing question_id in a question');
      doesNotAllow({ questions: { Q1: {
        question_id: 'Q1', question: '', answer: '42',
      } } }, 'missing question in a question');
    });
  });

  describe('retrieves a health assessment', () => {
    before(() => {
      fakeDB = { raw: x => x };
      fakeDB.select = sinon.stub().returns(fakeDB);
      fakeDB.column = sinon.stub().returns(fakeDB);
      fakeDB.table = sinon.stub().returns(fakeDB);
      prisonerAssessmentService = createPrisonerAssessmentService(fakeDB, fakeAppInfo);
    });

    it('returns the health assessment', () => {
      fakeDB.where = sinon.stub().resolves([{ health_assessment: validHealthAssessment }]);

      return prisonerAssessmentService.healthAssessmentFor(123)
      .then((healthResult) => {
        expect(fakeDB.select.callCount).to.eql(1);
        expect(fakeDB.column.callCount).to.eql(1);
        expect(fakeDB.column.lastCall.args[0]).to.eql('health_assessment');
        expect(fakeDB.table.callCount).to.eql(1);
        expect(fakeDB.table.lastCall.args[0]).to.eql('prisoner_assessments');
        expect(fakeDB.where.lastCall.args[0]).to.eql('id');
        expect(fakeDB.where.lastCall.args[1]).to.eql('=');
        expect(fakeDB.where.lastCall.args[2]).to.eql(123);
        expect(healthResult).to.eql(validHealthAssessment);
      });
    });

    it('returns a `not-found` error when the prisoner assessment cannot be found', () => {
      fakeDB.where = sinon.stub().resolves();

      return expect(prisonerAssessmentService.healthAssessmentFor(123))
      .to.be.rejectedWith(Error, 'No health assessment found for id: 123');
    });

    it('returns a `not-found` error when the health assessment cannot be found', () => {
      fakeDB.where = sinon.stub().resolves([]);

      return expect(prisonerAssessmentService.healthAssessmentFor(123))
      .to.be.rejectedWith(Error, 'No health assessment found for id: 123');
    });

    it('passes on the db error', () => {
      fakeDB.where = sinon.stub().rejects(new Error('Connection failed or something'));

      return expect(prisonerAssessmentService.healthAssessmentFor(123))
      .to.be.rejectedWith(Error, 'Connection failed or something');
    });
  });

  describe('retrieves an assessment', () => {
    before(() => {
      fakeDB = { raw: x => x };
      fakeDB.select = sinon.stub().returns(fakeDB);
      fakeDB.column = sinon.stub().returns(fakeDB);
      fakeDB.table = sinon.stub().returns(fakeDB);
      prisonerAssessmentService = createPrisonerAssessmentService(fakeDB, fakeAppInfo);
    });

    it('returns the assessment', () => {
      fakeDB.where = sinon.stub().resolves([{
        id: 123,
        created_at: '2017-07-28T11:54:23.576Z',
        updated_at: '2017-07-30T09:00:00.106Z',
        nomis_id: 'J1234LO',
        forename: 'John',
        surname: 'Lowe',
        date_of_birth: -77932800,
        outcome: 'Shared Cell',
        risk_assessment: { someKey: 'some valid data' },
        health_assessment: { someKey: 'some valid data' },
      }]);

      return prisonerAssessmentService.assessmentFor(123)
      .then((riskResult) => {
        expect(fakeDB.select.callCount).to.eql(1);
        expect(fakeDB.table.callCount).to.eql(1);
        expect(fakeDB.table.lastCall.args[0]).to.eql('prisoner_assessments');
        expect(fakeDB.where.lastCall.args[0]).to.eql('id');
        expect(fakeDB.where.lastCall.args[1]).to.eql('=');
        expect(fakeDB.where.lastCall.args[2]).to.eql(123);
        expect(riskResult).to.eql({
          id: 123,
          createdAt: '2017-07-28T11:54:23.576Z',
          updatedAt: '2017-07-30T09:00:00.106Z',
          nomisId: 'J1234LO',
          forename: 'John',
          surname: 'Lowe',
          dateOfBirth: -77932800,
          outcome: 'Shared Cell',
          riskAssessment: { someKey: 'some valid data' },
          healthAssessment: { someKey: 'some valid data' },
        });
      });
    });

    it('returns a `not-found` error when the prisoner assessment cannot be found', () => {
      fakeDB.where = sinon.stub().resolves();

      return expect(prisonerAssessmentService.assessmentFor(123))
      .to.be.rejectedWith(Error, 'No assessment found for id: 123');
    });

    it('returns a `not-found` error when the assessment cannot be found', () => {
      fakeDB.where = sinon.stub().resolves([]);

      return expect(prisonerAssessmentService.assessmentFor(123))
      .to.be.rejectedWith(Error, 'No assessment found for id: 123');
    });

    it('passes on the db error', () => {
      fakeDB.where = sinon.stub().rejects(new Error('Connection failed or something'));

      return expect(prisonerAssessmentService.assessmentFor(123))
      .to.be.rejectedWith(Error, 'Connection failed or something');
    });
  });

  describe('records the outcome', () => {
    function setup() {
      fakeDB = { raw: x => x };
      fakeDB.from = sinon.stub().returns(fakeDB);
      fakeDB.where = sinon.stub().onFirstCall().returns(fakeDB);
      fakeDB.update = sinon.stub().resolves([1]);
      prisonerAssessmentService = createPrisonerAssessmentService(fakeDB, fakeAppInfo);
    }

    describe('happy path', () => {
      before(() => {
        setup();
        prisonerAssessmentService.saveOutcome(123, { outcome: 'single cell' })
        .then((_result) => { result = _result; });
      });

      it('updates the prisoner assessments record with the health assessment', () => {
        expect(fakeDB.from.callCount).to.eql(1);
        expect(fakeDB.where.callCount).to.eql(1);
        expect(fakeDB.update.callCount).to.eql(1);
        expect(fakeDB.from.lastCall.args[0]).to.eql('prisoner_assessments');
        expect(fakeDB.where.lastCall.args[0]).to.eql('id');
        expect(fakeDB.where.lastCall.args[1]).to.eql('=');
        expect(fakeDB.where.lastCall.args[2]).to.eql(123);
        expect(fakeDB.update.lastCall.args[0].outcome).to
        .eql('single cell');
        expect(fakeDB.update.lastCall.args[0].updated_at).is.not.equal(undefined);
        expect(result).to.eql([1]);
      });
    });

    describe('unhappy path', () => {
      beforeEach(() => {
        fakeDB = { raw: x => x };
        fakeDB.from = sinon.stub().returns(fakeDB);
        fakeDB.where = sinon.stub().onFirstCall().returns(fakeDB);
        prisonerAssessmentService = createPrisonerAssessmentService(fakeDB, fakeAppInfo);
      });

      it('returns a `not-found` error  ', () => {
        fakeDB.update = sinon.stub().resolves([0]);

        return expect(prisonerAssessmentService.saveOutcome(999, { outcome: 'single cell' }))
        .to.be.rejectedWith(Error, 'Assessment id: 999 was not found');
      });

      it('passes on the db error', () => {
        fakeDB.update = sinon.stub().rejects(new Error('Connection failed or something'));

        return expect(prisonerAssessmentService.saveOutcome(123, { outcome: 'single cell' }))
        .to.be.rejectedWith(Error, 'Connection failed or something');
      });
    });

    describe('general validation stuff', () => {
      let error;
      before(() => {
        setup();
        return prisonerAssessmentService.saveOutcome(123, { outcome: 'junk' })
        .catch((err) => { error = err; });
      });

      it('returns validation error', () => {
        expect(error).to.be.an('error');
        expect(error).to.have.property('type', 'validation');
      });

      it('does not talk to the database when validation fails', () => {
        expect(fakeDB.update.callCount).to.eql(0);
      });
    });

    describe('rules', () => {
      beforeEach(() => {
        setup();
      });

      function allows(data, label) {
        const payload = Object.assign({}, { outcome: 'data' }, data);
        it(`allows ${label || JSON.stringify(data)}`, () =>
          expect(prisonerAssessmentService.saveOutcome(123, payload)).to.be.fulfilled);
      }
      function doesNotAllow(data, label) {
        const payload = Object.assign({}, { outcome: 'data' }, data);
        it(`denies ${label || JSON.stringify(data)}`, () =>
          expect(prisonerAssessmentService.saveOutcome(123, payload))
          .to.be.rejectedWith(Error, /Validation failed/));
      }

      allows({ outcome: 'single cell' });
      allows({ outcome: 'shared cell' });
      allows({ outcome: 'shared cell with conditions' });
      doesNotAllow({ outcome: 'release' });
      doesNotAllow({ outcome: 'shoe' });
      doesNotAllow({ outcome: undefined }, 'missing "outcome"');
    });
  });
});
