import assessmentStatusReducer from '../../../src/javascript/reducers/assessmentStatus';

describe('#assessmentStatusReducer', () => {
  const defaultState = {
    exitPoint: '',
    completed: [],
  };

  it('returns a default state', () => {
    expect(assessmentStatusReducer(undefined, 'UNKNOWN_ACTION')).to.eql(defaultState);
  });

  it('adds an exitPoint to the state', () => {
    const action = {
      type: 'SAVE_EXIT_POINT',
      payload: 'foo-risk-indicator',
    };
    const expectedState = {
      ...defaultState,
      exitPoint: 'foo-risk-indicator',
    };

    expect(assessmentStatusReducer(undefined, action)).to.eql(expectedState);
  });

  it('resets a the exit point when a user is selected', () => {
    const state = {
      ...defaultState,
      exitPoint: 'foo-exit-point',
    };

    const action = {
      type: 'SELECT_OFFENDER',
      payload: {},
    };

    const expectedState = {
      ...state,
      exitPoint: '',
    };

    expect(assessmentStatusReducer(state, action)).to.eql(expectedState);
  });

  it('adds a nomis-id to the completed list', () => {
    const state = {
      ...defaultState,
      exitPoint: 'foo-exit-point',
    };
    const outcome = {
      nomisId: 'foo-id',
      recommendation: 'foo-recommendation',
      rating: 'foo-rating',
      reasons: ['foo-reason'],
    };
    const action = {
      type: 'COMPLETE_ASSESSMENT',
      payload: outcome,
    };
    const expectedState = {
      ...defaultState,
      exitPoint: '',
      completed: [outcome],
    };

    expect(assessmentStatusReducer(state, action)).to.eql(expectedState);
  });
});
