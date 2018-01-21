import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import { replace, push } from 'react-router-redux';
import path from 'ramda/src/path';
import not from 'ramda/src/not';
import isNil from 'ramda/src/isNil';

import { capitalize, getUserDetailsFromDocument } from '../utils';
import postAssessmentToBackend from '../services/postAssessmentToBackend';
import getAssessmentsById from '../services/getAssessmentsById';
import {
  completeHealthAnswersFor,
  saveHealthcareAssessmentOutcome,
  storeHealthcareAssessmentFor,
} from '../actions';


import PrisonerProfile from '../components/PrisonerProfile';
import HealthcareSummaryTable from '../components/connected/HealthcareSummaryTable';

import routes from '../constants/routes';

class HealthCareSummary extends Component {
  componentDidMount() {
    const {
      storeHealthcareAssessment,
      markAnswersAsCompleteFor,
      saveOutcome,
      prisoner,
      answers,
      gotToErrorPage,
    } = this.props;

    const riskText = { no: 'shared cell', yes: 'single cell' };

    getAssessmentsById(prisoner.id, (response) => {
      if (not(response)) {
        return gotToErrorPage();
      }

      const healthcareAssessment = response.healthAssessment;

      if (healthcareAssessment) {
        return storeHealthcareAssessment({ id: prisoner.id, assessment: healthcareAssessment });
      }

      markAnswersAsCompleteFor({ assessmentId: this.props.prisoner.id });
      saveOutcome({ id: prisoner.id, outcome: riskText[answers.outcome.answer] });

      return true;
    });
  }

  renderAssessment() {
    const {
      prisoner,
      assessment,
      riskAssessmentComplete,
      onSubmit,
      healthcareAssessmentComplete,
      goToDashboardPage,
    } = this.props;

    return (
      <form
        id="hc-form"
        onSubmit={(e) => {
          e.preventDefault();

          this.submitBtn.setAttribute('disabled', true);

          onSubmit({
            assessmentId: prisoner.id,
            assessment,
          });
        }}
      >
        <h1 data-title="healthcare-summary" className="heading-xlarge">
          Healthcare assessment summary
        </h1>

        <div className="u-margin-bottom-bravo">
          <PrisonerProfile {...prisoner} />
        </div>

        <div className="panel panel-border-wide">
          <h3 className="heading-large" data-element-id="healthcare-outcome">
            Healthcare recommendation: {capitalize(assessment.outcome)}
          </h3>
        </div>

        <div data-element-id="health-summary" className="u-margin-bottom-alpha">
          <HealthcareSummaryTable
            assessmentComplete={healthcareAssessmentComplete}
            title="Assessment summary"
          />
        </div>

        <div className="form-group" data-summary-next-steps>
          {riskAssessmentComplete ? null : (
            <div className="u-margin-bottom-charlie">
              <h3 className="heading-medium">What happens next?</h3>
              <p>
                You must now complete the risk assessment questions to get a cell sharing outcome.
              </p>
            </div>
          )}

          { not(healthcareAssessmentComplete) && (
            <div className="notice c-notice u-clear-fix">
              <i className="icon icon-important">
                <span className="visually-hidden">Warning</span>
              </i>
              <strong className="bold-small">Once submitted you cannot change these answers</strong>
            </div>
          )}

          { not(healthcareAssessmentComplete) && (
            <button
              type="submit"
              className="button"
              data-element-id="continue-button"
              ref={(el) => {
                this.submitBtn = el;
              }}
            >
              Finish assessment
            </button>
          )}

          {healthcareAssessmentComplete && (
            <button
              type="button"
              className="button"
              data-element-id="continue-button"
              onClick={goToDashboardPage}
            >
              Return to Dashboard
            </button>
          )}
        </div>
      </form>
    );
  }

  render() {
    const {
      title,
      assessment,
    } = this.props;

    const healthAssessmentIsAvailable = not(isNil(assessment));

    return (
      <DocumentTitle title={title}>
        <div>{healthAssessmentIsAvailable && this.renderAssessment()}</div>
      </DocumentTitle>
    );
  }
}

HealthCareSummary.propTypes = {
  title: PropTypes.string,
  assessment: PropTypes.object,
  prisoner: PropTypes.object,
  riskAssessmentComplete: PropTypes.bool,
  markAnswersAsCompleteFor: PropTypes.func,
  storeHealthcareAssessment: PropTypes.func,
  onSubmit: PropTypes.func,
  saveOutcome: PropTypes.func,
  viperScore: PropTypes.object,
};

HealthCareSummary.defaultProps = {
  title: 'Healthcare Summary',
  markAnswersAsCompleteFor: () => {},
  onSubmit: () => {},
  saveOutcome: () => {},
};

const mapStateToProps = (state, ownProps) => {
  const selectedOffender = state.offender.selected;
  const healthcareAssessment = state.assessments.healthcare;

  return {
    ...ownProps,
    assessment: path([selectedOffender.id], healthcareAssessment),
    prisoner: selectedOffender,
    answers: path([selectedOffender.id, 'questions'], healthcareAssessment),
    riskAssessmentComplete: selectedOffender.riskAssessmentCompleted,
    healthcareAssessmentComplete: selectedOffender.healthAssessmentCompleted,
    viperScore: path([selectedOffender.id, 'viperScore'], healthcareAssessment),
  };
};
const mapActionsToProps = dispatch => ({
  goToDashboardPage: () => dispatch(push(routes.DASHBOARD)),
  gotToErrorPage: () => dispatch(replace(routes.ERROR_PAGE)),
  saveOutcome: ({ id, outcome }) => dispatch(saveHealthcareAssessmentOutcome({ id, outcome })),
  storeHealthcareAssessment: ({ id, assessment }) => dispatch(storeHealthcareAssessmentFor({ id, assessment })),
  onSubmit: ({ assessmentId, assessment }) => {
    const { name, username } = getUserDetailsFromDocument();
    const assessmentWithUsername = { ...assessment, username, name };

    getAssessmentsById(assessmentId, (response) => {
      if (not(response)) {
        return dispatch(replace(routes.ERROR_PAGE));
      }

      return postAssessmentToBackend(
        { assessmentId, assessmentType: 'health', assessment: assessmentWithUsername },
        (_response) => {
          if (not(_response)) {
            return dispatch(replace(routes.ERROR_PAGE));
          }

          if (response.riskAssessment) {
            return dispatch(replace(routes.FULL_ASSESSMENT_OUTCOME));
          }

          return dispatch(replace(routes.PRISONER_LIST));
        },
      );
    });
  },
  markAnswersAsCompleteFor: profile => dispatch(completeHealthAnswersFor(profile)),
});

export default connect(mapStateToProps, mapActionsToProps)(HealthCareSummary);
