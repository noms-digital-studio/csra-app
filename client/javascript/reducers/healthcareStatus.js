import {
  HEALTHCARE_ANSWERS_COMPLETE,
} from '../constants/actions';

import { addUniqElementToList } from '../utils';

const defaultState = {
  awaitingSubmission: [],
};

export default (state = defaultState, { type, payload }) => {
  switch (type) {
    case HEALTHCARE_ANSWERS_COMPLETE:
      return {
        ...state,
        awaitingSubmission: addUniqElementToList(
          payload,
          state.awaitingSubmission,
        ),
      };
    default:
      return state;
  }
};
