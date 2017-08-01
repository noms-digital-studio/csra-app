import debugModule from 'debug';

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

const debug = debugModule('csra');
const debugMiddleware = () => next => (action) => {
  debug('redux dispatch %j', action);
  return next(action);
};

const enhancer = composeWithDevTools(
  applyMiddleware(
    debugMiddleware,
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
});

export default createStore(reducers, enhancer);
