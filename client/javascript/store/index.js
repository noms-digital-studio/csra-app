import { createStore, combineReducers, applyMiddleware } from 'redux';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import { browserHistory } from 'react-router';
import { composeWithDevTools } from 'redux-devtools-extension';
import persistState from 'redux-sessionstorage';

import questionnaireReducer from '../reducers/questionnaire';
import offenderReducer from '../reducers/offender';
import loginReducer from '../reducers/login';
import answersReducer from '../reducers/answers';
import riskAssessmentStatusReducer from '../reducers/assessmentStatus';
import healthcareStatusReducer from '../reducers/healthcareStatus';
import assessmentOutcomesReducer from '../reducers/assessmentOutcomes';

// eslint-disable-next-line
const logger = store => next => action => {
  // eslint-disable-next-line
  console.log('dispatching', JSON.stringify(action));
  return next(action);
};

const enhancer = composeWithDevTools(
  applyMiddleware(
    logger,
    routerMiddleware(browserHistory),
  ),
  persistState(),
);

const reducers = combineReducers({
  routing: routerReducer,
  questions: questionnaireReducer,
  offender: offenderReducer,
  login: loginReducer,
  answers: answersReducer,
  riskAssessmentStatus: riskAssessmentStatusReducer,
  healthcareStatus: healthcareStatusReducer,
  assessmentOutcomes: assessmentOutcomesReducer,
});

export default createStore(reducers, enhancer);
