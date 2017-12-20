import React from 'react';
import { Router, Route, browserHistory } from 'react-router';

import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';

import Layout from './containers/Main';

import DashboardHoC from './pages/Dashboard';
import AddPrisonerHoc from './pages/AddPrisoner';
import OffenderProfileHoc from './pages/OffenderProfile';
import HealthcareAssessment from './pages/HealthcareAssessment';
import RiskAssessment from './pages/RiskAssessment';
import RiskAssessmentSummary from './pages/RiskAssessmentSummary';
import Feedback from './pages/Feedback';
import FeedbackConfirmation from './pages/FeedbackThankyou';
import HealthcareSummary from './pages/HealthcareSummary';
import FullAssessmentOutcome from './pages/FullAssessmentOutcome';

import Error404 from './pages/Error404';
import ErrorPage from './pages/ErrorPage';

export default (store) => {
  const history = syncHistoryWithStore(browserHistory, store);

  return (
    <Provider store={store}>
      <Router
        history={history}
        onUpdate={() => {
          window.scrollTo(0, 0);
          if (window.appInsights) {
            window.appInsights.trackPageView();
          }
        }}
      >
        <Route component={Layout}>
          <Route path="/" component={DashboardHoC} />
          <Route path="/dashboard" name="dashboard" component={DashboardHoC} />
          <Route
            path="/add-offender"
            name="add-offender"
            component={AddPrisonerHoc}
          />
          <Route
            path="/offender-profile"
            name="offender-profile"
            component={OffenderProfileHoc}
          />
          <Route
            path="/healthcare-assessment/:section"
            component={HealthcareAssessment}
          />
          <Route path="/healthcare-summary" component={HealthcareSummary} />

          <Route path="/risk-assessment/:section" component={RiskAssessment} />
          <Route
            path="/risk-assessment-summary"
            component={RiskAssessmentSummary}
          />
          <Route path="/feedback" component={Feedback} />
          <Route
            path="/feedback-confirmation"
            component={FeedbackConfirmation}
          />
          <Route
            path="/full-assessment-outcome"
            component={FullAssessmentOutcome}
          />
          <Route
            path="/error"
            component={ErrorPage}
          />
          <Route path="*" name="404" component={Error404} />
        </Route>
      </Router>
    </Provider>
  );
};
