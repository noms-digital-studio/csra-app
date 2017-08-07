import {
  GET_OFFENDER_ASSESSMENTS,
  SELECT_OFFENDER,
  ADD_PRISONER,
  CONFIRM_PRISONER,
} from '../constants/actions';

const defaultState = {
  selected: {},
  assessments: [],
  prisonerFormData: {},
};

export default (state = defaultState, { type, payload }) => {
  switch (type) {
    case GET_OFFENDER_ASSESSMENTS:
      return { ...state, assessments: payload };
    case SELECT_OFFENDER:
      return { ...state, selected: payload };
    case ADD_PRISONER:
      return { ...state, prisonerFormData: payload };
    case CONFIRM_PRISONER:
      return { ...state, prisonerFormData: {} };
    default:
      return state;
  }
};
