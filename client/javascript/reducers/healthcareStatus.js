import { COMPLETE_HEALTH_ASSESSMENT, SELECT_OFFENDER } from '../constants/actions';

const defaultState = {
  selected: {},
  completed: [],
};

export default (state = defaultState, { type, payload }) => {
  switch (type) {
    case SELECT_OFFENDER:
      return {
        ...state,
        selected: payload,
      };
    case COMPLETE_HEALTH_ASSESSMENT:
      return {
        ...state,
        completed: [...state.completed, payload],
      };
    default:
      return state;
  }
};
