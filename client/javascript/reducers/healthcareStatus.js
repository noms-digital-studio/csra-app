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

const filterOutPrisoner = (prisonerList, prisoner) =>
  prisonerList.filter(el => el.assessmentId !== prisoner.assessmentId);

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
        awaitingSubmission: filterOutPrisoner(state.awaitingSubmission, payload),
        completed: addUniqElementToList(payload, state.completed),
      };
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
