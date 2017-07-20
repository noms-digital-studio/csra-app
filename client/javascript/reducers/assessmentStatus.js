import { COMPLETE_RISK_ASSESSMENT } from '../constants/actions';

const defaultState = {
  completed: [],
};

export default (state = defaultState, { type, payload }) => {
  switch (type) {
    case COMPLETE_RISK_ASSESSMENT:
      return {
        ...state,
        completed: [...state.completed, payload],
      };
    default:
      return state;
  }
};
