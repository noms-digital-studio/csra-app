import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';
import path from 'ramda/src/path';
import not from 'ramda/src/not';

import { capitalize, getUsernameFromDocument } from '../utils';
import postAssessmentToBackend from '../services/postAssessmentToBackend';
import getAssessmentsById from '../services/getAssessmentsById';
import { completeHealthAnswersFor, saveHealthcareAssessmentOutcome } from '../actions';

import PrisonerProfile from '../components/PrisonerProfile';
import HealthcareSummaryTable from '../components/connected/HealthcareSummaryTable';

import routes from '../constants/routes';

class HealthCareSummary extends Component {
  componentDidMount() {
    const { markAnswersAsCompleteFor, saveOutcome, prisoner, answers } = this.props;
    const riskText = { no: 'shared cell', yes: 'single cell' };

    markAnswersAsCompleteFor({ assessmentId: this.props.prisoner.id });
    saveOutcome({ id: prisoner.id, outcome: riskText[answers.outcome.answer] });
  }

  render() {
    const {
      prisoner,
      title,
      assessment,
      riskAssessmentComplete,
      onSubmit,
      healthcareAssessmentComplete,
    } = this.props;

    return (
      <DocumentTitle title={title}>
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

            <div className="notice c-notice u-clear-fix">
              <i className="icon icon-important">
                <span className="visually-hidden">Warning</span>
              </i>
              <strong className="bold-small">Once submitted you cannot change these answers</strong>
            </div>

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
          </div>
        </form>
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
    healthcareAssessmentComplete: selectedOffender.healthcareAssessmentCompleted,
    viperScore: path([selectedOffender.id, 'viperScore'], healthcareAssessment),
  };
};
const mapActionsToProps = dispatch => ({
  saveOutcome: ({ id, outcome }) => dispatch(saveHealthcareAssessmentOutcome({ id, outcome })),
  onSubmit: ({ assessmentId, assessment }) => {
    const assessmentWithUsername = { ...assessment, username: getUsernameFromDocument() };

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

          return dispatch(replace(routes.DASHBOARD));
        },
      );
    });
  },
  markAnswersAsCompleteFor: profile => dispatch(completeHealthAnswersFor(profile)),
});

export default connect(mapStateToProps, mapActionsToProps)(HealthCareSummary);
