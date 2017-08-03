import {
  STORE_RISK_ASSESSMENT,
  START_RISK_ASSESSMENT,
  STORE_RISK_ASSESSMENT_ANSWER,
  STORE_RISK_ASSESSMENT_OUTCOME,
  STORE_RISK_ASSESSMENT_REASONS
} from '../constants/actions';

const updateObject = (obj, newValues) => ({ ...obj, ...newValues });

export default (state = {}, { type, payload }) => {
  switch (type) {
    case STORE_RISK_ASSESSMENT:
      return { ...state, [payload.id]: payload.assessment };
    case START_RISK_ASSESSMENT:
      return {
        ...state,
        [payload.id]: updateObject(state[payload.id], { viperScore: payload.viperScore }),
      };
    case STORE_RISK_ASSESSMENT_ANSWER:
      return {
        ...state,
        [payload.id]: {
          ...state[payload.id],
          questions: updateObject(state[payload.id].questions, payload.questionAnswer),
        },
      };
    case STORE_RISK_ASSESSMENT_OUTCOME:
      return {
        ...state,
        [payload.id]: updateObject(state[payload.id], { outcome: payload.outcome }),
      };
    case STORE_RISK_ASSESSMENT_REASONS:
      return {
        ...state,
        [payload.id]: updateObject(state[payload.id], { reasons: payload.reasons }),
      };
    default:
      return state;
  }
};
