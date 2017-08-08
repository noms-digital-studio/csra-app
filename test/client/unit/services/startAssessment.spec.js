import xhr from 'xhr';
import startAssessment
  from '../../../../client/javascript/services/startAssessment';


const postData = {
  nomisId: 'foo-id',
  surname: 'foo-surname',
  forename: 'foo-forename',
  dateOfBirth: '1-12-2010',
};

describe('#startAssessment', () => {
  let postStub;
  before(() => {
    postStub = sinon.stub(xhr, 'post');
  });
  after(() => {
    postStub.restore();
  });

  it('makes a POST request to /api/assessment', () => {
    const callback = sinon.spy();
    const responseBody = { id: 1 };

    postStub.yields(null, { status: 200 }, responseBody);

    startAssessment(postData, callback);

    expect(postStub.lastCall.args[0]).to.match(/\/api\/assessment/);
    expect(postStub.lastCall.args[1].json).to.eql(postData);
    expect(callback.calledOnce).to.equal(true);
    expect(callback.lastCall.args[0]).to.equal(responseBody.id, 'callback called with the correct response');
  });

  it('handles an unexpected response', () => {
    const callback = sinon.spy();
    const responseBody = { msg: 'foo error' };

    postStub.yields(null, { status: 500, body: responseBody }, responseBody);
    startAssessment(postData, callback);

    expect(callback.calledOnce).to.equal(true);
    expect(callback.lastCall.args[0]).to.equal(null, 'callback was not called with the null');
  });

  it('handles failed responses', () => {
    const callback = sinon.spy();
    const responseBody = { error: 'foo error' };

    postStub.yields(new Error('foo'), { status: 500 }, responseBody);
    startAssessment(postData, callback);

    expect(callback.calledOnce).to.equal(true);
    expect(callback.lastCall.args[0]).to.equal(null, 'callback was not called with the null');
  });
});
