import {
  GET_OFFENDER_ASSESSMENTS,
  SELECT_OFFENDER,
  STORE_PRISONER_SEARCH_RESULTS,
} from '../constants/actions';

const defaultState = {
  selected: {},
  assessments: [],
  searchResults: [],
};

export default (state = defaultState, { type, payload }) => {
  switch (type) {
    case GET_OFFENDER_ASSESSMENTS:
      return { ...state, assessments: payload };
    case SELECT_OFFENDER:
      return { ...state, selected: payload };
    case STORE_PRISONER_SEARCH_RESULTS:
      return { ...state, searchResults: payload };
    default:
      return state;
  }
};
