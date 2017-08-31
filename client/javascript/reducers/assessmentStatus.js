import {
  HEALTHCARE_ANSWERS_COMPLETE,
  RISK_ANSWERS_COMPLETE,
} from '../constants/actions';

import { addUniqElementToList } from '../utils';

const defaultState = {
  awaitingSubmission: {
    risk: [],
    healthcare: [],
  },
};

export default (state = defaultState, { type, payload }) => {
  switch (type) {
    case HEALTHCARE_ANSWERS_COMPLETE:
      return {
        ...state,
        awaitingSubmission: {
          ...state.awaitingSubmission,
          healthcare: addUniqElementToList(
            payload,
            state.awaitingSubmission.healthcare,
          ),
        },
      };
    case RISK_ANSWERS_COMPLETE:
      return {
        ...state,
        awaitingSubmission: {
          ...state.awaitingSubmission,
          risk: addUniqElementToList(
            payload,
            state.awaitingSubmission.risk,
          ),
        },
      };

    default:
      return state;
  }
};
