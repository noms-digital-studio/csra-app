import superagent from 'superagent';

import postAssessmentToBackend
  from '../../../../client/javascript/services/postAssessmentToBackend';

const postParams = {
  nomisId: 'foo-nomis-id',
  outcome: 'foo-outcome',
  viperScore: 0.1,
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
  nomisId: 'foo-nomis-id',
  outcome: 'foo-outcome',
  type: 'foo',
  viperScore: 0.1,
  questions: {
    'foo-section': {
      question: 'foo-title',
      question_id: 'foo-section',
      answer: 'no',
    },
    'bar-section': {
      question: 'bar-title',
      question_id: 'bar-section',
      answer: 'no',
    },
  },
  reasons: [],
};

describe('#postAssessmentToBackend', () => {
  let postStub;
  before(() => {
    postStub = sinon.stub(superagent, 'post');
  });
  after(() => {
    postStub.restore();
  });

  it('makes a POST request to /api/assessment', () => {
    const callback = sinon.spy();
    const response = { body: { data: { id: 123 } } };

    postStub.yields(null, response);

    postAssessmentToBackend('foo', postParams, callback);

    expect(postStub.lastCall.args[0]).to.match(/\/api\/assessment/);
    expect(postStub.lastCall.args[1]).to.eql(postData);

    expect(callback.calledOnce).to.equal(true);
    expect(callback.calledWithMatch(123)).to.equal(true, 'callback called with the correct');
  });

  it('handles failed responses', () => {
    const callback = sinon.spy();
    const response = { error: 'foo error' };

    postStub.yields(new Error('foo'), response);
    postAssessmentToBackend('foo', postParams, callback);

    expect(callback.calledOnce).to.equal(true);
    expect(callback.calledWithMatch(null)).to.equal(true, 'callback called with the correct');
  });
});
