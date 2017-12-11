import offenderReducer from '../../../../client/javascript/reducers/offender';

describe('#offenderReducer', () => {
  const defaultState = {
    selected: {},
    assessments: [],
    searchResults: [],
  };

  it('returns a default state', () => {
    expect(offenderReducer(undefined, { type: 'UNKNOWN_ACTION' })).to.eql(defaultState);
  });


  it('returns the state with offenders assessments included', () => {
    const assessments = [
      {
        bookingId: 123,
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
      bookingId: 123,
      nomisId: 'foo',
      surname: 'foobar',
      forename: 'foobaz',
      dateOfBirth: 'foo-age',
    };
    const action = { type: 'SELECT_OFFENDER', payload: profile };
    const expectedState = { ...defaultState, selected: profile };

    expect(offenderReducer(undefined, action)).to.eql(expectedState);
  });

  it('returns the state with the search results', () => {
    const results = [{
      bookingId: 123,
      offenderNo: 'foo-nomis-id',
      firstName: 'foo',
      middleName: 'bar',
      lastName: 'baz',
      dateOfBirth: '09-12-1921',
      facialImageId: null,
    }];
    const action = { type: 'STORE_PRISONER_SEARCH_RESULTS', payload: results };
    const expectedState = { ...defaultState, searchResults: results };

    expect(offenderReducer(undefined, action)).to.eql(expectedState);
  });
});
