import { createStore, combineReducers, applyMiddleware } from 'redux';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import { browserHistory } from 'react-router';
import { composeWithDevTools } from 'redux-devtools-extension';
import persistState from 'redux-sessionstorage';

import questionnaireReducer from '../reducers/questionnaire';
import offenderReducer from '../reducers/offender';
import loginReducer from '../reducers/login';
import answersReducer from '../reducers/answers';
import assessmentStatusReducer from '../reducers/assessmentStatus';
import healthcareStatusReducer from '../reducers/healthcareStatus';

const enhancer = composeWithDevTools(
  applyMiddleware(routerMiddleware(browserHistory)),
  persistState(),
);

const reducers = combineReducers({
  routing: routerReducer,
  questions: questionnaireReducer,
  offender: offenderReducer,
  login: loginReducer,
  answers: answersReducer,
  assessmentStatus: assessmentStatusReducer,
  healthcareStatus: healthcareStatusReducer,
});

export default createStore(reducers, enhancer);
