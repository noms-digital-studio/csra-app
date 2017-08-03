import {
  STORE_ASSESSMENT,
  START_ASSESSMENT,
  STORE_ASSESSMENT_ANSWER,
  STORE_ASSESSMENT_OUTCOME,
  STORE_ASSESSMENT_REASONS,
} from '../constants/actions';

const updateObject = (obj, newValues) => ({ ...obj, ...newValues });
const defaultState = {
  risk: {},
  healthcare: {},
};

export default (state = defaultState, { type, payload }) => {
  switch (type) {
    case STORE_ASSESSMENT:
      return {
        ...state,
        [payload.assessmentType]: {
          ...state[payload.assessmentType],
          [payload.id]: payload.assessment,
        },
      };
    case START_ASSESSMENT:
      return {
        ...state,
        [payload.assessmentType]: {
          ...state[payload.assessmentType],
          [payload.id]: updateObject(state[payload.id], { viperScore: payload.viperScore }),
        },
      };
    case STORE_ASSESSMENT_ANSWER:
      return {
        ...state,
        [payload.assessmentType]: {
          ...state[payload.assessmentType],
          [payload.id]: {
            ...state[payload.assessmentType][payload.id],
            questions: updateObject(state[payload.assessmentType][payload.id].questions, payload.questionAnswer),
          },
        },
      };
    case STORE_ASSESSMENT_OUTCOME:
      return {
        ...state,
        [payload.assessmentType]: {
          ...state[payload.assessmentType],
          [payload.id]: updateObject(state[payload.assessmentType][payload.id], {
            outcome: payload.outcome,
          }),
        },
      };
    case STORE_ASSESSMENT_REASONS:
      return {
        ...state,
        [payload.assessmentType]: {
          ...state[payload.assessmentType],
          [payload.id]: updateObject(state[payload.assessmentType][payload.id], {
            reasons: payload.reasons,
          }),
        },
      };
    default:
      return state;
  }
};
