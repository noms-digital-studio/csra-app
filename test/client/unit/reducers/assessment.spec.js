import assessmentsReducer from '../../../../client/javascript/reducers/assessment';

describe('#assessments', () => {
  const defaultState = {
    risk: {},
    healthcare: {},
  };

  it('returns a default state', () => {
    expect(assessmentsReducer(undefined, { type: 'UNKNOWN_ACTION' })).to.eql(defaultState);
  });

  it('returns the state with an assessment saved', () => {
    const payload = {
      assessmentType: 'risk',
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
      type: 'STORE_ASSESSMENT',
      payload,
    };

    const expectedState = {
      ...defaultState,
      risk: {
        1: payload.assessment,
      },
    };

    expect(assessmentsReducer(undefined, action)).to.eql(expectedState);
  });

  it('returns the state with a new assessment', () => {
    const payload = {
      assessmentType: 'healthcare',
      id: 1,
      viperScore: null,
    };

    const action = {
      type: 'START_ASSESSMENT',
      payload,
    };

    const expectedState = {
      ...defaultState,
      healthcare: {
        1: {
          viperScore: null,
        },
      },
    };

    expect(assessmentsReducer(undefined, action)).to.eql(expectedState);
  });

  it('returns the state with a stored question answer', () => {
    const initialState = {
      ...defaultState,
      risk: {
        1: {
          viperScore: 0.1,
        },
      },
    };

    const payload = {
      assessmentType: 'risk',
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
      type: 'STORE_ASSESSMENT_ANSWER',
      payload,
    };

    const expectedState = {
      ...initialState,
      risk: {
        1: {
          viperScore: 0.1,
          questions: {
            ...payload.questionAnswer,
          },
        },
      },
    };

    expect(assessmentsReducer(initialState, action)).to.eql(expectedState);
  });

  it('returns the state with an updated stored question answer', () => {
    const initialState = {
      ...defaultState,
      health: {
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
      },
    };

    const payload = {
      assessmentType: 'health',
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
      type: 'STORE_ASSESSMENT_ANSWER',
      payload,
    };

    const expectedState = {
      ...initialState,
      health: {
        1: {
          viperScore: 0.1,
          questions: {
            ...payload.questionAnswer,
          },
        },
      },
    };

    expect(assessmentsReducer(initialState, action)).to.eql(expectedState);
  });

  it('returns the state with an outcome', () => {
    const initialState = {
      ...defaultState,
      risk: {
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
      },
    };

    const payload = {
      assessmentType: 'risk',
      id: 1,
      outcome: 'foo outcome',
    };

    const action = {
      type: 'STORE_ASSESSMENT_OUTCOME',
      payload,
    };

    const expectedState = {
      ...initialState,
      risk: {
        1: {
          ...initialState.risk[1],
          outcome: 'foo outcome',
        },
      },
    };

    expect(assessmentsReducer(initialState, action)).to.eql(expectedState);
  });

  it('returns the state with saved reasons', () => {
    const initialState = {
      ...defaultState,
      risk: {
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
      },
    };

    const payload = {
      id: 1,
      assessmentType: 'risk',
      reasons: [
        {
          question_id: 'foo-id',
          reason: 'foo reason',
        },
      ],
    };

    const action = {
      type: 'STORE_ASSESSMENT_REASONS',
      payload,
    };

    const expectedState = {
      ...initialState,
      risk: {
        1: {
          ...initialState.risk[1],
          reasons: payload.reasons,
        },
      },
    };

    expect(assessmentsReducer(initialState, action)).to.eql(expectedState);
  });
});
