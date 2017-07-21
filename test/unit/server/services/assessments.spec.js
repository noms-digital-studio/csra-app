import createPrisonerAssessmentService from '../../../../server/services/assessments';

describe('assessment service', () => {
  let fakeDB;
  let fakeAppInfo;
  let prisonerAssessment;
  let result;

  function setup() {
    fakeDB = { raw: x => x };
    fakeDB.insert = sinon.stub().returns(fakeDB);
    fakeDB.into = sinon.stub().returns(fakeDB);
    fakeDB.returning = sinon.stub().resolves([123]);

    fakeAppInfo = {
      getGitRef: sinon.stub(),
      getGitDate: sinon.stub(),
      getQuestionHash: sinon.stub(),
    };

    prisonerAssessment = createPrisonerAssessmentService(fakeDB, fakeAppInfo);
  }

  const validPrisonerAssessment = {
    nomisId: 'J1234LO',
    forename: 'John',
    surname: 'Lowe',
    dateOfBirth: '31 December 1988',
  };

  describe('recording prisoner assessment into DB', () => {
    before(() => {
      setup();
      fakeAppInfo.getGitRef.returns('gifref');
      fakeAppInfo.getGitDate.returns(new Date('2017-06-02T11:15:00'));
      fakeAppInfo.getQuestionHash.withArgs('risk').returns('foo');
      fakeAppInfo.getQuestionHash.withArgs('healthcare').returns('bar');

      return prisonerAssessment.save(validPrisonerAssessment)
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
  });

  describe('validation', () => {
    describe('general validation stuff', () => {
      let error;
      before(() => {
        setup();
        return prisonerAssessment.save({ some: 'junk' })
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
          expect(prisonerAssessment.save(payload)).to.be.fulfilled);
      }

      function doesNotAllow(data, label) {
        const payload = Object.assign({}, validPrisonerAssessment, data);
        it(`denies ${label || JSON.stringify(data)}`, () =>
          expect(prisonerAssessment.save(payload))
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
});
