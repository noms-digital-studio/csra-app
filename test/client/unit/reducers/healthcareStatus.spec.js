import healthcareStatusReducer
  from '../../../../client/javascript/reducers/healthcareStatus';

describe('#healthcareStatusReducer', () => {
  const defaultState = {
    selected: {},
    completed: [],
    awaitingSubmission: [],
  };

  const profile = {
    NOMS_Number: 'foo',
    Surname: 'foobar',
    First_Name: 'foobaz',
    Date_of_Birth: 'foo-age',
  };

  it('returns a default state', () => {
    expect(healthcareStatusReducer(undefined, 'UNKNOWN_ACTION')).to.eql(
      defaultState,
    );
  });

  it('returns the state with the selected offender', () => {
    const action = { type: 'SELECT_OFFENDER', payload: profile };
    const expectedState = { ...defaultState, selected: profile };

    expect(healthcareStatusReducer(undefined, action)).to.eql(expectedState);
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

  it('adds a profile to the completed list', () => {
    const action = {
      type: 'COMPLETE_HEALTH_ASSESSMENT',
      payload: profile,
    };

    const expectedState = {
      ...defaultState,
      completed: [profile],
    };

    expect(healthcareStatusReducer(undefined, action)).to.eql(expectedState);
  });

  it('removes profiles from the awaitingSubmition list when the become complete', () => {
    const action = {
      type: 'COMPLETE_HEALTH_ASSESSMENT',
      payload: profile,
    };

    const state = {
      ...defaultState,
      awaitingSubmission: [profile],
      completed: [],
    };

    const expectedState = {
      ...defaultState,
      awaitingSubmission: [],
      completed: [profile],
    };

    expect(healthcareStatusReducer(state, action)).to.eql(expectedState);
  });
});
