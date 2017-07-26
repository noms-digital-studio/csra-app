import xhr from 'xhr';

import getAssessments from '../../../../client/javascript/services/getAssessments';

const response = [
  {
    id: 1,
    nomisId: 'foo-id',
    surname: 'foo-surname',
    forename: 'foo-first-name',
    dateOfBirth: '1-12-2010',
    riskAssessmentCompleted: true,
    healthAssessmentCompleted: true,
    outcome: 'Foo outcome',
  },
  {
    id: 2,
    nomisId: 'bar-id',
    surname: 'foo-surname',
    forename: 'foo-first-name',
    dateOfBirth: '12-2-2010',
    riskAssessmentCompleted: false,
    healthAssessmentCompleted: false,
    outcome: undefined,
  },
];


describe('#getAssessments', () => {
  let getStub;
  before(() => {
    getStub = sinon.stub(xhr, 'get');
  });
  after(() => {
    getStub.restore();
  });

  it('makes a GET request to /api/assessments', () => {
    const callback = sinon.spy();
    const responseBody = response;

    getStub.yields(null, { status: 200 }, responseBody);

    getAssessments(callback);

    expect(getStub.lastCall.args[0]).to.match(/\/api\/assessments/);
    expect(callback.lastCall.args[0]).to.equal(responseBody);
  });

  it('handles an unexpected response', () => {
    const callback = sinon.spy();
    const responseBody = { msg: 'foo error' };

    getStub.yields(null, { status: 500 }, responseBody);
    getAssessments(callback);

    expect(getStub.lastCall.args[0]).to.match(/\/api\/assessments/);
    expect(callback.lastCall.args[0]).to.equal(null);
  });

  it('handles failed responses', () => {
    const callback = sinon.spy();
    const responseBody = { error: 'foo error' };

    getStub.yields(new Error('foo'), { status: 500 }, responseBody);
    getAssessments(callback);

    expect(getStub.lastCall.args[0]).to.match(/\/api\/assessments/);
    expect(callback.lastCall.args[0]).to.equal(null);
  });
});
