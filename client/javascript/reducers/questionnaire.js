import { GET_ASSESSMENT_QUESTIONS, GET_HEALTH_ASSESSMENT_QUESTIONS } from '../constants/actions';

const defaultState = {
  csra: [],
  healthcare: [],
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case GET_ASSESSMENT_QUESTIONS:
      return { ...state, csra: action.payload };

    case GET_HEALTH_ASSESSMENT_QUESTIONS:
      return { ...state, healthcare: action.payload };
    default:
      return state;
  }
};
