import {
  GET_RISK_ASSESSMENT_QUESTIONS,
  GET_HEALTH_ASSESSMENT_QUESTIONS,
} from '../constants/actions';

const defaultState = {
  riskAssessment: [],
  healthcare: [],
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case GET_RISK_ASSESSMENT_QUESTIONS:
      return { ...state, riskAssessment: action.payload };

    case GET_HEALTH_ASSESSMENT_QUESTIONS:
      return { ...state, healthcare: action.payload };
    default:
      return state;
  }
};
