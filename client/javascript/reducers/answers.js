import {
  SELECT_OFFENDER,
  SAVE_RISK_ASSESSMENT_ANSWER,
  SAVE_HEALTHCARE_ANSWER,
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

export default (state = defaultState, { type, payload }) => {
  switch (type) {
    case SELECT_OFFENDER:
      return { ...state, selectedPrisonerId: payload.nomisId };

    case SAVE_RISK_ASSESSMENT_ANSWER:
      return saveAnswer(state, payload, 'riskAssessment');

    case SAVE_HEALTHCARE_ANSWER:
      return saveAnswer(state, payload, 'healthcare');

    default:
      return state;
  }
};
