import {
  SELECT_OFFENDER,
  SAVE_RISK_ASSESSMENT_ANSWER,
  SAVE_HEALTHCARE_ANSWER,
  CLEAR_RISK_ASSESSMENT_ANSWERS,
} from '../constants/actions';

const defaultState = {
  selectedPrisonerId: '',
  riskAssessment: {},
  healthcare: {},
};

const upsertAnswer = (answers, newAnswer) => ({ ...answers, ...newAnswer });

const saveAnswer = (state, payload, type) => ({
  ...state,
  [type]: {
    ...state[type],
    [state.selectedPrisonerId]: upsertAnswer(
      state[type][state.selectedPrisonerId],
      payload,
    ),
  },
});

const clearAnswers = (state, nomisId, type) => {
  const answers = state[type];

  const updatedAnswers = Object.keys(answers).reduce((acc, key) => {
    if (key === nomisId) {
      return acc;
    }
    return { ...acc, [key]: answers[key] };
  }, {});

  return { ...state, [type]: updatedAnswers };
};

export default (state = defaultState, { type, payload }) => {
  switch (type) {
    case SELECT_OFFENDER:
      return { ...state, selectedPrisonerId: payload.nomisId };

    case SAVE_RISK_ASSESSMENT_ANSWER:
      return saveAnswer(state, payload, 'riskAssessment');

    case CLEAR_RISK_ASSESSMENT_ANSWERS:
      return clearAnswers(state, payload, 'riskAssessment');

    case SAVE_HEALTHCARE_ANSWER:
      return saveAnswer(state, payload, 'healthcare');

    default:
      return state;
  }
};
