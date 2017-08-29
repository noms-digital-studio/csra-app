import assessmentStatusReducer
  from '../../../../client/javascript/reducers/assessmentStatus';

describe('#assessmentStatusReducer', () => {
  const defaultState = {
    awaitingSubmission: {
      healthcare: [],
      risk: [],
    },
  };

  const profile = {
    id: 1,
    nomisId: 'foo',
    surname: 'foobar',
    forename: 'foobaz',
    dateOfBirth: 'foo-age',
  };

  it('returns a default state', () => {
    expect(assessmentStatusReducer(undefined, 'UNKNOWN_ACTION')).to.eql(
      defaultState,
    );
  });

  it('adds a profile to the healthcare awaiting submission list', () => {
    const action = {
      type: 'HEALTHCARE_ANSWERS_COMPLETE',
      payload: profile,
    };

    const expectedState = {
      ...defaultState,
      awaitingSubmission: {
        risk: [],
        healthcare: [profile],
      },
    };

    expect(assessmentStatusReducer(undefined, action)).to.eql(expectedState);
  });

  it('adds a profile to the healthcare awaiting submission list', () => {
    const action = {
      type: 'RISK_ANSWERS_COMPLETE',
      payload: profile,
    };

    const expectedState = {
      ...defaultState,
      awaitingSubmission: {
        risk: [profile],
        healthcare: [],
      },
    };

    expect(assessmentStatusReducer(undefined, action)).to.eql(expectedState);
  });
});
