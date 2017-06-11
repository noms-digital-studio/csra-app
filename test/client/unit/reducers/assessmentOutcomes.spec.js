import assessmentOutcomesReducer from '../../../../client/javascript/reducers/assessmentOutcomes';

describe('assessmentOutcomes', () => {
  const defaultState = {};

  it('returns a default state', () => {
    expect(assessmentOutcomesReducer(undefined, 'UNKNOWN_ACTION')).to.eql(defaultState);
  });

  it('returns the state with a saved outcome', () => {
    const action = {
      type: 'SAVE_OUTCOME',
      payload: {
        nomisId: 'foo-nomis-id',
        outcome: 'Foo outcome',
      },
    };
    const expectedState = {
      'foo-nomis-id': 'Foo outcome',
    };

    expect(assessmentOutcomesReducer(undefined, action)).to.eql(expectedState);
  });
});
