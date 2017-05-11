import questionnaireReducer from '../../../src/javascript/reducers/questionnaire';

describe('questionnaireReducer', () => {
  const defaultState = {
    csra: [],
    healthcare: [],
  };

  it('returns a default state', () => {
    expect(questionnaireReducer(undefined, 'UNKNOWN_ACTION')).to.eql(defaultState);
  });

  it('returns the state with csra questions included', () => {
    const questions = [
      {
        section: 'foo-risk-indicator',
        title: 'foo-title',
        description: 'foo-description',
        template: 'foo-template',
      },
    ];
    const action = { type: 'GET_ASSESSMENT_QUESTIONS', payload: questions };
    const expectedState = { ...defaultState, csra: questions };

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
    const action = { type: 'GET_HEALTH_ASSESSMENT_QUESTIONS', payload: questions };
    const expectedState = { ...defaultState, healthcare: questions };

    expect(questionnaireReducer(undefined, action)).to.eql(expectedState);
  });
});
