import xhr from 'xhr';

import postAssessmentToBackend
  from '../../../../client/javascript/services/postAssessmentToBackend';

const postParams = {
  assessmentType: 'risk',
  assessmentId: 1,
  viperScore: 0.1,
  outcome: 'foo-outcome',
  questions: [
    {
      section: 'foo-section',
      title: 'foo-title',
      sharedCellPredicate: {
        type: 'QUESTION',
        value: 'no',
        dependents: ['foo-section'],
        reasons: [],
      },
    },
    {
      title: 'bar-title',
      section: 'bar-section',
      sharedCellPredicate: {
        type: 'QUESTION',
        value: 'no',
        dependents: ['bar-section'],
        reasons: ['bar-reason'],
      },
    },
  ],
  answers: {
    'foo-section': {
      answer: 'no',
    },
    'bar-section': {
      answer: 'no',
    },
  },
};

const postData = {
  outcome: 'foo-outcome',
  viperScore: 0.1,
  questions: {
    'foo-section': {
      question: 'foo-title',
      questionId: 'foo-section',
      answer: 'no',
    },
    'bar-section': {
      question: 'bar-title',
      questionId: 'bar-section',
      answer: 'no',
    },
  },
  reasons: [],
};

describe('#postAssessmentToBackend', () => {
  let postStub;
  before(() => {
    postStub = sinon.stub(xhr, 'put');
  });
  after(() => {
    postStub.restore();
  });

  it('makes a PUT request to /api/assessments/1/risk', () => {
    const callback = sinon.spy();

    postStub.yields(null, { statusCode: 200 });

    postAssessmentToBackend(postParams, callback);

    expect(postStub.lastCall.args[0]).to.match(/\/api\/assessments\/1\/risk/);
    expect(postStub.lastCall.args[1].json).to.eql(postData);

    expect(callback.calledOnce).to.equal(true);
    expect(callback.calledWithMatch({ status: 'ok' })).to.equal(true, 'callback called with the correct response');
  });

  it('handles an unexpected response', () => {
    const callback = sinon.spy();
    const responseBody = { msg: 'foo error' };

    postStub.yields(null, { statusCode: 500, body: responseBody }, responseBody);
    postAssessmentToBackend(postParams, callback);

    expect(callback.calledOnce).to.equal(true);
    expect(callback.calledWithMatch(null)).to.equal(true, 'callback was not called with the null');
  });

  it('handles failed responses', () => {
    const callback = sinon.spy();
    const responseBody = { error: 'foo error' };

    postStub.yields(new Error('foo'), { statusCode: 500 }, responseBody);
    postAssessmentToBackend(postParams, callback);

    expect(callback.calledOnce).to.equal(true);
    expect(callback.calledWithMatch(null)).to.equal(true, 'callback was not called with the null');
  });
});
