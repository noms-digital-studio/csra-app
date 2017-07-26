import { addUniqElementToList } from '../utils';
import {
  GET_OFFENDER_ASSESSMENTS,
  GET_VIPER_SCORES,
  SELECT_OFFENDER,
  ADD_PRISONER,
  ADD_VIPER_SCORE,
  CONFIRM_PRISONER,
} from '../constants/actions';

const defaultState = {
  selected: {},
  assessments: [],
  viperScores: [],
  prisonerFormData: {},
};

export default (state = defaultState, { type, payload }) => {
  switch (type) {
    case GET_OFFENDER_ASSESSMENTS:
      return { ...state, assessments: payload };
    case GET_VIPER_SCORES:
      return { ...state, viperScores: payload };
    case ADD_VIPER_SCORE:
      return { ...state, viperScores: addUniqElementToList(payload, state.viperScores) };
    case SELECT_OFFENDER:
      return { ...state, selected: payload };
    case ADD_PRISONER:
      return { ...state, prisonerFormData: payload };
    case CONFIRM_PRISONER:
      return { ...state, prisonerFormData: {}, assessments: [...state.assessments, payload] };
    default:
      return state;
  }
};
