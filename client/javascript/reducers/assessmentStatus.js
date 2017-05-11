import { COMPLETE_ASSESSMENT, SAVE_EXIT_POINT, SELECT_OFFENDER } from '../constants/actions';

const defaultState = {
  completed: [],
  exitPoint: '',
};

export default (state = defaultState, { type, payload }) => {
  switch (type) {
    case SELECT_OFFENDER:
      return {
        ...state,
        exitPoint: '',
      };
    case COMPLETE_ASSESSMENT:
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
    default:
      return state;
  }
};
