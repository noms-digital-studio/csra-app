import healthcareStatusReducer
  from '../../../../client/javascript/reducers/healthcareStatus';

describe('#healthcareStatusReducer', () => {
  const defaultState = {
    awaitingSubmission: [],
  };

  const profile = {
    id: 1,
    nomisId: 'foo',
    surname: 'foobar',
    forename: 'foobaz',
    dateOfBirth: 'foo-age',
  };

  it('returns a default state', () => {
    expect(healthcareStatusReducer(undefined, 'UNKNOWN_ACTION')).to.eql(
      defaultState,
    );
  });

  it('adds a profile to the awaiting submission list', () => {
    const action = {
      type: 'HEALTHCARE_ANSWERS_COMPLETE',
      payload: profile,
    };

    const expectedState = {
      ...defaultState,
      awaitingSubmission: [profile],
    };

    expect(healthcareStatusReducer(undefined, action)).to.eql(expectedState);
  });
});
