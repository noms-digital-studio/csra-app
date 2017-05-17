import {
  COMPLETE_HEALTH_ASSESSMENT,
  SELECT_OFFENDER,
  HEALTHCARE_ANSWERS_COMPLETE,
} from '../constants/actions';

import { addUniqElementToList } from '../utils';

const defaultState = {
  selected: {},
  completed: [],
  awaitingSubmission: [],
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
        awaitingSubmission: state.awaitingSubmission.filter(
          prisoner => prisoner.NOMS_Number !== payload.NOMS_Number
        ),
        completed: addUniqElementToList(payload, state.completed),
      };
    case HEALTHCARE_ANSWERS_COMPLETE:
      return {
        ...state,
        awaitingSubmission: [...state.completed, payload],
      };
    default:
      return state;
  }
};
