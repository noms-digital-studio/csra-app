import offenderReducer from '../../../../client/javascript/reducers/offender';

describe('#offenderReducer', () => {
  const defaultState = {
    selected: {},
    profiles: [],
    viperScores: [],
    prisonerFormData: {},
  };

  it('returns a default state', () => {
    expect(offenderReducer(undefined, 'UNKNOWN_ACTION')).to.eql(defaultState);
  });

  it('returns the state with viper scores included', () => {
    const scores = [{ nomisId: 'FOO', viperScore: 1 }];
    const action = { type: 'GET_VIPER_SCORES', payload: scores };
    const expectedState = { ...defaultState, viperScores: scores };

    expect(offenderReducer(undefined, action)).to.eql(expectedState);
  });

  it('returns the state with offenders profiles included', () => {
    const profiles = [
      {
        NOMS_Number: 'foo',
        Surname: 'foobar',
        First_Name: 'foobaz',
        Date_of_Birth: 'foo-age',
      },
    ];
    const action = { type: 'GET_OFFENDER_NOMIS_PROFILES', payload: profiles };
    const expectedState = { ...defaultState, profiles };

    expect(offenderReducer(undefined, action)).to.eql(expectedState);
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

    expect(offenderReducer(undefined, action)).to.eql(expectedState);
  });

  it('returns the state with the temporary created prisoner', () => {
    const prisonerData = {
      'first-name': 'foo',
      'last-name': 'bar',
      'dob-day': '01',
      'dob-month': '10',
      'dob-year': '1997',
      'nomis-id': 'AA12345',
    };

    const action = { type: 'ADD_PRISONER', payload: prisonerData };
    const expectedState = { ...defaultState, prisonerFormData: prisonerData };

    expect(offenderReducer(undefined, action)).to.eql(expectedState);
  });

  it('returns the state with the prisoner added to the profiles', () => {
    const prisonerFormData = {
      'first-name': 'foo',
      'last-name': 'bar',
      'dob-day': '01',
      'dob-month': '10',
      'dob-year': '1997',
      'nomis-id': 'AA12345',
    };

    const newProfile = {
      NOMS_Number: 'AA12345',
      Surname: 'bar',
      First_Name: 'foo',
      Date_of_Birth: '01-10-1997',
    };

    const state = { ...defaultState, prisonerFormData };
    const action = { type: 'CONFIRM_PRISONER', payload: newProfile };
    const expectedState = {
      ...defaultState,
      prisonerFormData: {},
      profiles: [...state.profiles, newProfile],
    };

    expect(offenderReducer(state, action)).to.eql(expectedState);
  });
});
