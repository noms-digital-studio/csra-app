import offenderReducer from '../../../../client/javascript/reducers/offender';

describe('#offenderReducer', () => {
  const defaultState = {
    selected: {},
    assessments: [],
    prisonerFormData: {},
  };

  it('returns a default state', () => {
    expect(offenderReducer(undefined, { type: 'UNKNOWN_ACTION' })).to.eql(defaultState);
  });


  it('returns the state with offenders assessments included', () => {
    const assessments = [
      {
        nomisId: 'foo',
        surname: 'foobar',
        forename: 'foobaz',
        dateOfBirth: 'foo-age',
      },
    ];
    const action = { type: 'GET_OFFENDER_ASSESSMENTS', payload: assessments };
    const expectedState = { ...defaultState, assessments };

    expect(offenderReducer(undefined, action)).to.eql(expectedState);
  });

  it('returns the state with the selected offender', () => {
    const profile = {
      nomisId: 'foo',
      surname: 'foobar',
      forename: 'foobaz',
      dateOfBirth: 'foo-age',
    };
    const action = { type: 'SELECT_OFFENDER', payload: profile };
    const expectedState = { ...defaultState, selected: profile };

    expect(offenderReducer(undefined, action)).to.eql(expectedState);
  });

  it('returns the state with the temporary created prisoner', () => {
    const prisonerData = {
      forename: 'foo',
      surname: 'bar',
      'dob-day': '01',
      'dob-month': '10',
      'dob-year': '1997',
      nomisId: 'AA12345',
    };

    const action = { type: 'ADD_PRISONER', payload: prisonerData };
    const expectedState = { ...defaultState, prisonerFormData: prisonerData };

    expect(offenderReducer(undefined, action)).to.eql(expectedState);
  });

  it('returns the state with the prisoner added to the assessments', () => {
    const prisonerFormData = {
      forename: 'foo',
      surname: 'bar',
      'dob-day': '01',
      'dob-month': '10',
      'dob-year': '1997',
      nomisId: 'AA12345',
    };

    const state = { ...defaultState, prisonerFormData };
    const action = { type: 'CONFIRM_PRISONER' };
    const expectedState = {
      ...defaultState,
      prisonerFormData: {},
    };

    expect(offenderReducer(state, action)).to.eql(expectedState);
  });
});
