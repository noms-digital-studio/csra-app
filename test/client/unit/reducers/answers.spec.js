import answersReducer from '../../../../client/javascript/reducers/answers';

describe('answersReducer', () => {
  const defaultState = {
    selectedAssessmentId: '',
    riskAssessment: {},
    healthcare: {},
  };

  it('returns a default state', () => {
    expect(answersReducer(undefined, 'UNKNOWN_ACTION')).to.eql(defaultState);
  });

  it('stores the selected assessment', () => {
    const profile = {
      id: 1,
      nomisId: 'foo',
      surname: 'foobar',
      forename: 'foobaz',
      dateOfBirth: 'foo-age',
    };
    const action = { type: 'SELECT_OFFENDER', payload: profile };
    const expectedState = {
      ...defaultState,
      selectedAssessmentId: profile.id,
    };

    expect(answersReducer(undefined, action)).to.eql(expectedState);
  });

  it('saves an answer for the selectedAssessmentId', () => {
    const selectedAssessmentId = 'foo-id';
    const state = { ...defaultState, selectedAssessmentId };
    const assessmentTypes = {
      riskAssessment: 'SAVE_RISK_ASSESSMENT_ANSWER',
      healthcare: 'SAVE_HEALTHCARE_ANSWER',
    };

    Object.keys(assessmentTypes).forEach((assessmentType) => {
      const action = {
        type: assessmentTypes[assessmentType],
        payload: { fooRisk: { answer: 'yes' } },
      };

      const expectedState = {
        ...state,
        [assessmentType]: {
          [selectedAssessmentId]: {
            fooRisk: { answer: 'yes' },
          },
        },
      };

      expect(answersReducer(state, action)).to.eql(expectedState);
    });
  });

  it('updates an answer for the selectedAssessmentId', () => {
    const selectedAssessmentId = 'foo-id';

    const assessmentTypes = {
      riskAssessment: 'SAVE_RISK_ASSESSMENT_ANSWER',
      healthcare: 'SAVE_HEALTHCARE_ANSWER',
    };

    Object.keys(assessmentTypes).forEach((assessmentType) => {
      const state = {
        selectedAssessmentId,
        [assessmentType]: {
          [selectedAssessmentId]: {
            fooRisk: { answer: 'yes' },
          },
        },
      };
      const action = {
        type: assessmentTypes[assessmentType],
        payload: { fooRisk: { answer: 'no' } },
      };
      const expectedState = {
        ...state,
        [assessmentType]: {
          [selectedAssessmentId]: {
            fooRisk: { answer: 'no' },
          },
        },
      };

      expect(answersReducer(state, action)).to.eql(expectedState);
    });
  });
});
