import { SAVE_OUTCOME } from '../constants/actions';

const defaultState = {};

export default (state = defaultState, { type, payload }) => {
  switch (type) {
    case SAVE_OUTCOME:
      return {
        ...state,
        [payload.nomisId]: payload.outcome,
      };
    default:
      return state;
  }
};
