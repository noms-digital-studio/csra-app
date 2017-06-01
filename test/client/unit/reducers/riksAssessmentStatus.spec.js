import riskAssessmentStatusReducer from '../../../../client/javascript/reducers/assessmentStatus';

describe('#riskAssessmentStatusReducer', () => {
  const defaultState = {
    exitPoint: '',
    completed: [],
  };

  it('returns a default state', () => {
    expect(riskAssessmentStatusReducer(undefined, 'UNKNOWN_ACTION')).to.eql(defaultState);
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

    expect(riskAssessmentStatusReducer(undefined, action)).to.eql(expectedState);
  });

  it('resets the exit point', () => {
    const state = {
      ...defaultState,
      exitPoint: 'foo-exit-point',
    };

    const action = {
      type: 'CLEAR_EXIT_POINT',
    };

    const expectedState = {
      ...state,
      exitPoint: '',
    };

    expect(riskAssessmentStatusReducer(state, action)).to.eql(expectedState);
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
      type: 'COMPLETE_RISK_ASSESSMENT',
      payload: outcome,
    };
    const expectedState = {
      ...defaultState,
      exitPoint: '',
      completed: [outcome],
    };

    expect(riskAssessmentStatusReducer(state, action)).to.eql(expectedState);
  });
});