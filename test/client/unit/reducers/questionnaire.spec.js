import questionnaireReducer
  from '../../../../client/javascript/reducers/questionnaire';

describe('questionnaireReducer', () => {
  const defaultState = {
    riskAssessment: [],
    healthcare: [],
  };

  it('returns a default state', () => {
    expect(questionnaireReducer(undefined, 'UNKNOWN_ACTION')).to.eql(defaultState);
  });

  it('returns the state with risk assessment questions included', () => {
    const questions = [
      {
        section: 'foo-risk-indicator',
        title: 'foo-title',
        description: 'foo-description',
        template: 'foo-template',
      },
    ];
    const action = { type: 'GET_RISK_ASSESSMENT_QUESTIONS', payload: questions };
    const expectedState = { ...defaultState, riskAssessment: questions };

    expect(questionnaireReducer(undefined, action)).to.eql(expectedState);
  });

  it('returns the state with healthcare questions included', () => {
    const questions = [
      {
        section: 'foo-risk-indicator',
        title: 'foo-title',
        description: 'foo-description',
        template: 'foo-template',
      },
    ];
    const action = {
      type: 'GET_HEALTH_ASSESSMENT_QUESTIONS',
      payload: questions,
    };
    const expectedState = { ...defaultState, healthcare: questions };

    expect(questionnaireReducer(undefined, action)).to.eql(expectedState);
  });
});
