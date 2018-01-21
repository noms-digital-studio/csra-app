import debugModule from 'debug';

import { createStore, combineReducers, applyMiddleware } from 'redux';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import { composeWithDevTools } from 'redux-devtools-extension';
import persistState from 'redux-sessionstorage';

import questionnaireReducer from '../reducers/questionnaire';
import offenderReducer from '../reducers/offender';
import assessmentStatusReducer from '../reducers/assessmentStatus';
import assessmentReducer from '../reducers/assessment';

const history = createHistory();
const debug = debugModule('csra');
const debugMiddleware = () => next => (action) => {
  debug('redux dispatch %j', action);
  return next(action);
};

const enhancer = composeWithDevTools(
  applyMiddleware(
    debugMiddleware,
    routerMiddleware(history),
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

const store = createStore(reducers, enhancer);

export { store, history };
