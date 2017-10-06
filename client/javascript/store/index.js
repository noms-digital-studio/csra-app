import debugModule from 'debug';

import { createStore, combineReducers, applyMiddleware } from 'redux';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import { browserHistory } from 'react-router';
import { composeWithDevTools } from 'redux-devtools-extension';
import persistState from 'redux-sessionstorage';

import questionnaireReducer from '../reducers/questionnaire';
import offenderReducer from '../reducers/offender';
import assessmentStatusReducer from '../reducers/assessmentStatus';
import assessmentReducer from '../reducers/assessment';


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
  assessmentStatus: assessmentStatusReducer,
  assessments: assessmentReducer,
});

export default createStore(reducers, enhancer);
