import createPrisonerAssessmentService from '../../../../server/services/assessments';

describe('prisoner assessment service', () => {
  const validPrisonerAssessment = {
    nomisId: 'J1234LO',
    forename: 'John',
    surname: 'Lowe',
    dateOfBirth: '31 December 1988',
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
      it('sets dob from request', () => expect(row.date_of_birth).to.equal('31 December 1988'));
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

      allows({ dateOfBirth: '20 December 1978' });
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

    it('Returns the summaries', () => {
      fakeDB.table = sinon.stub().resolves(
        [{
          id: 123,
          nomis_id: 'J1234LO',
          forename: 'John',
          surname: 'Lowe',
          date_of_birth: '14-07-1967',
          outcome: null,
          risk_assessment: '{"data": "value"}',
          health_assessment: null,
        },
        {
          id: 567,
          nomis_id: 'R1234MO',
          forename: 'Richard',
          surname: 'Moyen',
          date_of_birth: '31-12-1988',
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
          dateOfBirth: '14-07-1967',
          outcome: null,
          riskAssessment: true,
          healthAssessment: false,
        },
        {
          id: 567,
          nomisId: 'R1234MO',
          forename: 'Richard',
          surname: 'Moyen',
          dateOfBirth: '31-12-1988',
          outcome: 'Shared Cell',
          riskAssessment: true,
          healthAssessment: true,
        }]);
      });
    });

    it('Returns an empty list when the Db is empty', () => {
      fakeDB.table = sinon.stub().resolves([]);
      return prisonerAssessmentService.list()
      .then((listResult) => {
        expect(fakeDB.table.lastCall.args[0]).to.eql('prisoner_assessments');
        expect(listResult).to.eql([]);
      });
    });
  });

  describe('updates the prisoner assessment record', () => {
    const validateRiskAssessment = {
      riskAssessment: {
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
      },
    };

    function setup() {
      fakeDB = { raw: x => x };
      fakeDB.from = sinon.stub().returns(fakeDB);
      fakeDB.where = sinon.stub().returns(fakeDB);
      fakeDB.update = sinon.stub().resolves();

      prisonerAssessmentService = createPrisonerAssessmentService(fakeDB, fakeAppInfo);
    }

    before(() => {
      setup();
      return prisonerAssessmentService.saveRiskAssessment(123, validateRiskAssessment)
      .then((_result) => { result = _result; });
    });

    it('update the prisoner assessments record with the risk assessment', () => {
      expect(fakeDB.from.callCount).to.eql(1);
      expect(fakeDB.where.callCount).to.eql(1);
      expect(fakeDB.update.callCount).to.eql(1);
      expect(fakeDB.from.lastCall.args[0]).to.eql('prisoner_assessments');
      expect(fakeDB.where.lastCall.args[0]).to.eql('id');
      expect(fakeDB.where.lastCall.args[1]).to.eql('=');
      expect(fakeDB.where.lastCall.args[2]).to.eql(123);
    });
  });
});
