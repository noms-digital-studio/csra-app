import xhr from 'xhr';
import saveAssessmentsOutcome
  from '../../../../client/javascript/services/saveAssessmentsOutcome';

const postData = {
  assessmentId: 1,
  outcome: 'foo outcome',
};

describe('#saveAssessmentsOutcome', () => {
  let postStub;
  before(() => {
    postStub = sinon.stub(xhr, 'put');
  });
  after(() => {
    postStub.restore();
  });

  it('makes a POST request to /api/assessment', () => {
    const callback = sinon.spy();
    const responseBody = { id: 1 };

    postStub.yields(null, { statusCode: 200 }, responseBody);

    saveAssessmentsOutcome(postData, callback);

    expect(postStub.lastCall.args[0]).to.match(/\/api\/assessments\/1\/outcome/);
    expect(postStub.lastCall.args[1].json).to.eql({ outcome: 'foo outcome' });
    expect(callback.calledOnce).to.equal(true);
    expect(callback.calledWithMatch({ status: 'ok' })).to.equal(true, 'callback called with the correct response');
  });

  it('handles an unexpected response', () => {
    const callback = sinon.spy();
    const responseBody = { msg: 'foo error' };

    postStub.yields(null, { statusCode: 500, body: responseBody }, responseBody);
    saveAssessmentsOutcome(postData, callback);

    expect(callback.calledOnce).to.equal(true);
    expect(callback.lastCall.args[0]).to.equal(null, 'callback was not called with the null');
  });

  it('handles failed responses', () => {
    const callback = sinon.spy();
    const responseBody = { error: 'foo error' };

    postStub.yields(new Error('foo'), { statusCode: 500 }, responseBody);
    saveAssessmentsOutcome(postData, callback);

    expect(callback.calledOnce).to.equal(true);
    expect(callback.lastCall.args[0]).to.equal(null, 'callback was not called with the null');
  });
});
