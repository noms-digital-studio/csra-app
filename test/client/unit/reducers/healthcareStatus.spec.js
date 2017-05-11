import healthcareStatusReducer from '../../../src/javascript/reducers/healthcareStatus';

describe('#healthcareStatusReducer', () => {
  const defaultState = {
    selected: {},
    completed: [],
  };

  it('returns a default state', () => {
    expect(healthcareStatusReducer(undefined, 'UNKNOWN_ACTION')).to.eql(
      defaultState,
    );
  });

  it('returns the state with the selected offender', () => {
    const profile = {
      NOMS_Number: 'foo',
      Surname: 'foobar',
      First_Name: 'foobaz',
      Date_of_Birth: 'foo-age',
    };
    const action = { type: 'SELECT_OFFENDER', payload: profile };
    const expectedState = { ...defaultState, selected: profile };

    expect(healthcareStatusReducer(undefined, action)).to.eql(expectedState);
  });

  it('adds a nomis-id to the completed list', () => {
    const nomisId = 'foo-id';

    const action = {
      type: 'COMPLETE_HEALTH_ASSESSMENT',
      payload: nomisId,
    };

    const expectedState = {
      ...defaultState,
      completed: [nomisId],
    };

    expect(healthcareStatusReducer(undefined, action)).to.eql(expectedState);
  });
});
