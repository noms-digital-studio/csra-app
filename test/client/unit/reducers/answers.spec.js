import answersReducer from '../../../../client/javascript/reducers/answers';

describe('answersReducer', () => {
  const defaultState = {
    selectedPrisonerId: '',
    riskAssessment: {},
    healthcare: {},
  };

  it('returns a default state', () => {
    expect(answersReducer(undefined, 'UNKNOWN_ACTION')).to.eql(defaultState);
  });

  it('stores the selected prisoner', () => {
    const profile = {
      nomisId: 'foo',
      surname: 'foobar',
      forename: 'foobaz',
      dateOfBirth: 'foo-age',
    };
    const action = { type: 'SELECT_OFFENDER', payload: profile };
    const expectedState = {
      ...defaultState,
      selectedPrisonerId: profile.nomisId,
    };

    expect(answersReducer(undefined, action)).to.eql(expectedState);
  });

  it('saves an answer for the selectedPrisonerId', () => {
    const selectedPrisonerId = 'foo-id';
    const state = { ...defaultState, selectedPrisonerId };
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
          [selectedPrisonerId]: {
            fooRisk: { answer: 'yes' },
          },
        },
      };

      expect(answersReducer(state, action)).to.eql(expectedState);
    });
  });

  it('updates an answer for the selectedPrisonerId', () => {
    const selectedPrisonerId = 'foo-id';

    const assessmentTypes = {
      riskAssessment: 'SAVE_RISK_ASSESSMENT_ANSWER',
      healthcare: 'SAVE_HEALTHCARE_ANSWER',
    };

    Object.keys(assessmentTypes).forEach((assessmentType) => {
      const state = {
        selectedPrisonerId,
        [assessmentType]: {
          [selectedPrisonerId]: {
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
          [selectedPrisonerId]: {
            fooRisk: { answer: 'no' },
          },
        },
      };

      expect(answersReducer(state, action)).to.eql(expectedState);
    });
  });
});
