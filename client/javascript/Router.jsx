import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';

import Layout from './containers/Main';

import Dashboard from './pages/Dashboard';
import AddPrisonerHoc from './pages/AddPrisoner';
import OffenderProfile from './pages/OffenderProfile';
import HealthcareAssessment from './pages/HealthcareAssessment';
import RiskAssessment from './pages/RiskAssessment';
import RiskAssessmentSummary from './pages/RiskAssessmentSummary';
import Feedback from './pages/Feedback';
import FeedbackConfirmation from './pages/FeedbackThankyou';
import HealthcareSummary from './pages/HealthcareSummary';
import FullAssessmentOutcome from './pages/FullAssessmentOutcome';
import PrisonerList from './pages/PrisonerList';

import Error404 from './pages/Error404';
import ErrorPage from './pages/ErrorPage';

export default ({ store, history }) => (
  <Provider store={store}>
    <ConnectedRouter
      history={history}
      onUpdate={() => {
        window.scrollTo(0, 0);
        if (window.appInsights) {
          window.appInsights.trackPageView();
        }
      }}
    >
      <Layout>
        <Switch>
          <Route exact path="/" component={Dashboard} />
          <Route path="/dashboard" name="dashboard" component={Dashboard} />
          <Route path="/prisoner-list" name="prisoner-list" component={PrisonerList} />
          <Route
            path="/add-offender"
            name="add-offender"
            component={AddPrisonerHoc}
          />
          <Route
            path="/offender-profile"
            name="offender-profile"
            component={OffenderProfile}
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
          <Route name="404" component={Error404} />
        </Switch>
      </Layout>
    </ConnectedRouter>
  </Provider>
);
