import riskAssessmentReducer from '../../../../client/javascript/reducers/riskAssessment';

describe.only('#riskAssessment', () => {
  const defaultState = {};

  it('returns a default state', () => {
    expect(riskAssessmentReducer(undefined, { type: 'UNKNOWN_ACTION' })).to.eql(defaultState);
  });

  it('returns the state with a riskAssessment saved', () => {
    const payload = {
      id: 1,
      assessment: {
        outcome: 'foo outcome',
        viperScore: 0.1,
        questions: {
          question_id: {
            question: 'foo questions',
            answer: 'foo answer',
            comments: 'foo comment',
          },
        },
        reason: [
          {
            question_id: 'foo-id',
            reason: 'foo reason',
          },
        ],
      },
    };

    const action = {
      type: 'STORE_RISK_ASSESSMENT',
      payload,
    };

    const expectedState = {
      1: payload.assessment,
    };

    expect(riskAssessmentReducer(undefined, action)).to.eql(expectedState);
  });

  it('returns the state with a new empty assessment', () => {
    const payload = { id: 1, viperScore: 0.1 };

    const action = {
      type: 'START_RISK_ASSESSMENT',
      payload,
    };

    const expectedState = {
      1: {
        viperScore: 0.1,
      },
    };

    expect(riskAssessmentReducer(undefined, action)).to.eql(expectedState);
  });

  it('returns the state with a stored question answer', () => {
    const initialState = {
      1: {
        viperScore: 0.1,
      },
    };

    const payload = {
      id: 1,
      questionAnswer: {
        question_id: {
          question: 'foo question',
          answer: 'foo answer',
          comments: 'foo comments',
        },
      },
    };

    const action = {
      type: 'STORE_RISK_ASSESSMENT_ANSWER',
      payload,
    };

    const expectedState = {
      ...initialState,
      1: {
        viperScore: 0.1,
        questions: {
          ...payload.questionAnswer,
        },
      },
    };

    expect(riskAssessmentReducer(initialState, action)).to.eql(expectedState);
  });

  it('returns the state with an updated stored question answer', () => {
    const initialState = {
      1: {
        viperScore: 0.1,
        questions: {
          question_id: {
            question: 'foo question',
            answer: 'foo answer',
            comments: 'foo comments',
          },
        },
      },
    };

    const payload = {
      id: 1,
      questionAnswer: {
        question_id: {
          question: 'foo question',
          answer: 'bar answer',
          comments: 'bar comments',
        },
      },
    };

    const action = {
      type: 'STORE_RISK_ASSESSMENT_ANSWER',
      payload,
    };

    const expectedState = {
      ...initialState,
      1: {
        viperScore: 0.1,
        questions: {
          ...payload.questionAnswer,
        },
      },
    };

    expect(riskAssessmentReducer(initialState, action)).to.eql(expectedState);
  });

  it('returns the state with an outcome', () => {
    const initialState = {
      1: {
        viperScore: 0.1,
        questions: {
          question_id: {
            question: 'foo question',
            answer: 'foo answer',
            comments: 'foo comments',
          },
        },
      },
    };

    const payload = {
      id: 1,
      outcome: 'foo outcome',
    };

    const action = {
      type: 'STORE_RISK_ASSESSMENT_OUTCOME',
      payload,
    };

    const expectedState = {
      ...initialState,
      1: {
        ...initialState[1],
        outcome: 'foo outcome',
      },
    };

    expect(riskAssessmentReducer(initialState, action)).to.eql(expectedState);
  });

  it('returns the state with saved reasons', () => {
    const initialState = {
      1: {
        viperScore: 0.1,
        outcome: 'foo outcome',
        questions: {
          question_id: {
            question: 'foo question',
            answer: 'foo answer',
            comments: 'foo comments',
          },
        },
      },
    };

    const payload = {
      id: 1,
      reasons: [{
        question_id: 'foo-id',
        reason: 'foo reason',
      }],
    };

    const action = {
      type: 'STORE_RISK_ASSESSMENT_REASONS',
      payload,
    };

    const expectedState = {
      ...initialState,
      1: {
        ...initialState[1],
        reasons: payload.reasons,
      },
    };

    expect(riskAssessmentReducer(initialState, action)).to.eql(expectedState);
  });
});
