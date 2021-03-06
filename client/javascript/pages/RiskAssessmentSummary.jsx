import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import { replace, push } from 'react-router-redux';
import path from 'ramda/src/path';
import not from 'ramda/src/not';
import isEmpty from 'ramda/src/isEmpty';
import isNil from 'ramda/src/isNil';

import {
  saveRiskAssessmentOutcome,
  saveRiskAssessmentReasons,
  completeRiskAnswersFor,
  storeRiskAssessmentFor,
} from '../actions';
import { capitalize, getUserDetailsFromDocument } from '../utils';
import { extractDecision } from '../services';

import postAssessmentToBackend from '../services/postAssessmentToBackend';
import getAssessmentsById from '../services/getAssessmentsById';

import PrisonerProfile from '../components/PrisonerProfile';
import RiskAssessmentSummaryTable from '../components/connected/RiskAssessmentSummaryTable';

import routes from '../constants/routes';


const rating = outcome => ({ 'single cell': 'high' }[outcome] || 'standard');

class RiskAssessmentSummary extends Component {
  componentDidMount() {
    const {
      prisoner,
      questions,
      answers,
      viperScore,
      saveOutcome,
      saveReasons,
      markAnswersAsCompleteFor,
      gotToErrorPage,
      storeRiskAssessment,
    } = this.props;

    getAssessmentsById(prisoner.id, (response) => {
      if (not(response)) {
        return gotToErrorPage();
      }

      const riskAssessment = response.riskAssessment;

      if (riskAssessment) {
        return storeRiskAssessment({ id: prisoner.id, assessment: riskAssessment });
      }

      const decision = extractDecision({
        questions,
        answers,
        viperScore,
      });

      markAnswersAsCompleteFor({ assessmentId: prisoner.id });
      saveOutcome({ id: prisoner.id, outcome: decision.recommendation });
      saveReasons({ id: prisoner.id, reasons: decision.reasons });

      return true;
    });
  }

  renderAssessment() {
    const {
      prisoner,
      onSubmit,
      outcome,
      reasons,
      healthcareAssessmentComplete,
      riskAssessmentComplete,
      assessment,
      goToDashboardPage,
    } = this.props;

    return (
      <div>
        <form
          id="rsa-form"
          onSubmit={(e) => {
            e.preventDefault();

            this.submitBtn.setAttribute('disabled', true);

            onSubmit({
              assessmentId: prisoner.id,
              assessment,
            });
          }}
        >
          <div className="grid-row">
            <div className="column-two-thirds">
              <h1 data-title="risk-summary" className="heading-xlarge">Risk assessment summary</h1>
            </div>
            <div className="column-one-third">
              <div className="c-print-link c-print-link--small-mt">
                <button className="c-icon-button link" type="button" onClick={() => window.print()}>
                  Print Page
                </button>
              </div>
            </div>
          </div>

          <div className="u-margin-bottom-bravo">
            <PrisonerProfile {...prisoner} />
          </div>

          <div data-element-id="assessment-results" className="panel panel-border-wide">
            <h2 className="heading-large" data-element-id="risk-assessment-risk">
              Cell violence risk: {capitalize(rating(outcome))}
            </h2>
            <h3 className="heading-medium" data-element-id="risk-assessment-outcome">
              Allocation recommendation: {capitalize(outcome)}
            </h3>

            {not(isEmpty(reasons)) && (
              <div>
                <p>Why:</p>
                <ul
                  data-element-id="risk-assessment-reasons"
                  className="list list-bullet c-reasons-list"
                >
                  {reasons.map(item => (
                    <li key={item.questionId}>
                      <span className="u-d-block">{item.reason}</span>
                      <span className="u-d-block">
                        {assessment.questions[item.questionId]['reasons-for-answer'] &&
                          `“${assessment.questions[item.questionId]['reasons-for-answer']}”`}
                        {assessment.questions[item.questionId]['reasons-yes'] &&
                          `“${assessment.questions[item.questionId]['reasons-yes']}”`}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {not(healthcareAssessmentComplete) && (
              <p className="u-margin-top-charlie">
                Both the risk and allocation recommendation could change after the healthcare
                assessment.
              </p>
            )}
          </div>

          <div className="u-margin-bottom-bravo">
            <RiskAssessmentSummaryTable
              assessmentComplete={riskAssessmentComplete}
              title="Assessment answers"
            />
          </div>

          <div className="form-group" data-summary-next-steps>
            {((riskAssessmentComplete && healthcareAssessmentComplete) || healthcareAssessmentComplete) ? null : (
              <div className="u-margin-bottom-charlie">
                <h3 className="heading-medium">What happens next?</h3>
                <p className="u-margin-bottom-charlie">
                  <span>You must print a copy of this summary for healthcare.</span>
                  <span className="u-spacing-right" />
                  <button
                    type="button"
                    className="c-icon-button link u-print-hide"
                    onClick={() => window.print()}
                  >
                    Print Page
                  </button>
                </p>
              </div>
            )}
            { not(riskAssessmentComplete) && (
              <div>
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
            )}

            {riskAssessmentComplete && (
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
      </div>
    );
  }

  render() {
    const {
      title,
      outcome,
      assessment,
    } = this.props;

    const riskAssessmentIsAvailable = not(isNil(assessment)) && not(isEmpty(outcome));

    return (
      <DocumentTitle title={title}>
        <div>{ riskAssessmentIsAvailable && this.renderAssessment() }</div>
      </DocumentTitle>
    );
  }
}

RiskAssessmentSummary.propTypes = {
  title: PropTypes.string,
  outcome: PropTypes.string,
  onSubmit: PropTypes.func,
  saveOutcome: PropTypes.func,
  saveReasons: PropTypes.func,
  gotToErrorPage: PropTypes.func,
  storeRiskAssessment: PropTypes.func,
  markAnswersAsCompleteFor: PropTypes.func,
  prisoner: PropTypes.shape({
    id: PropTypes.number,
    forename: PropTypes.string,
    dateOfBirth: PropTypes.string,
    nomisId: PropTypes.string,
    surname: PropTypes.string,
  }),
  healthcareAssessmentComplete: PropTypes.bool,
  riskAssessmentComplete: PropTypes.bool,
  viperScore: PropTypes.number,
  answers: PropTypes.object,
  questions: PropTypes.array,
  reasons: PropTypes.array,
  assessment: PropTypes.object,
};

RiskAssessmentSummary.defaultProps = {
  title: 'Risk Assessment Summary',
  outcome: '',
  reasons: [],
  prisoner: {},
  onSubmit: () => {},
  saveOutcome: () => {},
};

const mapStateToProps = (state) => {
  const selectedOffender = state.offender.selected;
  const viperScore = path([selectedOffender.id, 'viperScore'], state.assessments.risk);
  const answers = path([selectedOffender.id, 'questions'], state.assessments.risk);

  return {
    prisoner: selectedOffender,
    assessment: path([selectedOffender.id], state.assessments.risk),
    viperScore,
    answers,
    questions: state.questions.riskAssessment,
    outcome: path([selectedOffender.id, 'outcome'], state.assessments.risk),
    reasons: path([selectedOffender.id, 'reasons'], state.assessments.risk),
    healthcareAssessmentComplete: selectedOffender.healthAssessmentCompleted,
    riskAssessmentComplete: selectedOffender.riskAssessmentCompleted,
  };
};

const mapActionsToProps = dispatch => ({
  goToDashboardPage: () => dispatch(push(routes.DASHBOARD)),
  gotToErrorPage: () => dispatch(replace(routes.ERROR_PAGE)),
  storeRiskAssessment: ({ id, assessment }) => dispatch(storeRiskAssessmentFor({ id, assessment })),
  markAnswersAsCompleteFor: profile => dispatch(completeRiskAnswersFor(profile)),
  saveOutcome: ({ id, outcome }) => dispatch(saveRiskAssessmentOutcome({ id, outcome })),
  saveReasons: ({ id, reasons }) => dispatch(saveRiskAssessmentReasons({ id, reasons })),
  onSubmit: ({ assessment, assessmentId }) => {
    const { name, username } = getUserDetailsFromDocument();
    const assessmentWithUsername = { ...assessment, username, name };

    getAssessmentsById(assessmentId, (response) => {
      if (not(response)) {
        return dispatch(replace(routes.ERROR_PAGE));
      }

      return postAssessmentToBackend(
        { assessmentId, assessment: assessmentWithUsername, assessmentType: 'risk' },
        (_response) => {
          if (not(_response)) {
            return dispatch(replace(routes.ERROR_PAGE));
          }

          if (response.healthAssessment) {
            return dispatch(replace(routes.FULL_ASSESSMENT_OUTCOME));
          }

          return dispatch(replace(routes.DASHBOARD));
        },
      );
    });
  },
});

export default connect(mapStateToProps, mapActionsToProps)(RiskAssessmentSummary);
