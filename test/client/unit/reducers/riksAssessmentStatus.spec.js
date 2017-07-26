import riskAssessmentStatusReducer from '../../../../client/javascript/reducers/assessmentStatus';

describe('#riskAssessmentStatusReducer', () => {
  const defaultState = {
    completed: [],
  };

  it('returns a default state', () => {
    expect(riskAssessmentStatusReducer(undefined, 'UNKNOWN_ACTION')).to.eql(defaultState);
  });

  it('adds a nomis-id to the completed list', () => {
    const state = {
      ...defaultState,
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
      completed: [outcome],
    };

    expect(riskAssessmentStatusReducer(state, action)).to.eql(expectedState);
  });
});
