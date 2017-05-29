import { COMPLETE_RISK_ASSESSMENT, SAVE_EXIT_POINT, CLEAR_EXIT_POINT } from '../constants/actions';

const defaultState = {
  completed: [],
  exitPoint: '',
};

export default (state = defaultState, { type, payload }) => {
  switch (type) {
    case COMPLETE_RISK_ASSESSMENT:
      return {
        ...state,
        exitPoint: '',
        completed: [...state.completed, payload],
      };
    case SAVE_EXIT_POINT:
      return {
        ...state,
        exitPoint: payload,
      };
    case CLEAR_EXIT_POINT:
      return {
        ...state,
        exitPoint: '',
      };
    default:
      return state;
  }
};
