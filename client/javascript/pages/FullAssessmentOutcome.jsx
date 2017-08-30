import React, { PropTypes, Component } from 'react';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';
import not from 'ramda/src/not';
import path from 'ramda/src/path';
import isEmpty from 'ramda/src/isEmpty';

import { cellAssignment } from '../services';
import getAssessmentsById from '../services/getAssessmentsById';
import saveAssessmentsOutcome from '../services/saveAssessmentsOutcome';

import { capitalize } from '../utils';

import { storeRiskAssessmentFor, storeHealthcareAssessmentFor } from '../actions';

import PrisonerProfile from '../components/PrisonerProfile';
import RiskAssessmentSummaryTable from '../components/connected/RiskAssessmentSummaryTable';
import HealthcareSummaryTable from '../components/connected/HealthcareSummaryTable';
import SelectableInput from '../components/SelectableInput';

import routes from '../constants/routes';

const calculateFinalOutcome = (healthcareOutcome, riskAssessmentOutcome) =>
  cellAssignment({
    healthcare: {
      sharedCell: healthcareOutcome === 'shared cell',
    },
    riskAssessment: {
      sharedCell: /shared cell/.test(riskAssessmentOutcome),
      conditions: riskAssessmentOutcome === 'shared cell with conditions',
    },
  });

class FullAssessmentOutcome extends Component {
  componentDidMount() {
    const {
      prisoner,
      storeRiskAssessment,
      storeHealthcareAssessment,
      storeOutcome,
      gotToErrorPage,
    } = this.props;

    getAssessmentsById(prisoner.id, (response) => {
      if (not(response)) {
        return gotToErrorPage();
      }

      const riskAssessment = JSON.parse(response.riskAssessment);
      const healthcareAssessment = JSON.parse(response.healthAssessment);
      const assessmentOutCome = response.outcome;

      if (not(assessmentOutCome)) {
        const finalOutcome = calculateFinalOutcome(
          healthcareAssessment.outcome,
          riskAssessment.outcome,
        );

        storeOutcome({ assessmentId: prisoner.id, outcome: finalOutcome });
      }

      storeRiskAssessment({ id: prisoner.id, assessment: riskAssessment });
      storeHealthcareAssessment({ id: prisoner.id, assessment: healthcareAssessment });

      return false;
    });
  }

  renderFullOutcome() {
    const {
      prisoner,
      riskAssessment,
      healthAssessment,
      alreadyCompleted,
      onReturnHome,
    } = this.props;

    const finalOutcome =
      prisoner.outcome || calculateFinalOutcome(healthAssessment.outcome, riskAssessment.outcome);
    const reasons = riskAssessment.reasons;
    const rating = { 'single cell': 'high' }[finalOutcome] || 'standard';

    return (
      <div>
        <div className="grid-row">
          <div className="column-two-thirds">
            <div className="govuk-box-highlight u-margin-bottom-bravo">
              <p>
                &nbsp; <br />
              </p>
              <h1 data-title="full-outcome" className="bold-large">
                Assessment complete
              </h1>
              <p>
                &nbsp; <br />
              </p>
            </div>
          </div>
          <div className="column-one-third">
            <div className="c-print-link u-text-align-right u-no-margin">
              <button type="button" className="c-icon-button link" onClick={() => window.print()}>
                Print Page
              </button>
            </div>
          </div>
        </div>

        <div className="grid-row">
          <div className="column-two-thirds">
            <div className="u-margin-bottom-bravo">
              <PrisonerProfile {...prisoner} />
            </div>

            <div className="panel panel-border-wide">
              <h3 className="heading-large" data-element-id="recommended-rating">
                CSRA and healthcare risk: {capitalize(rating)}
              </h3>
              <p>
                The risk of violence towards a cellmate is worked out by the Prison Violence
                Predictor and the answers given in the assessment.
              </p>
              <h3 className="heading-medium" data-element-id="recommended-outcome">
                Allocation recommendation: {capitalize(finalOutcome)}
              </h3>

              {not(isEmpty(reasons)) && (
                <div>
                  <p>Why:</p>
                  <ul
                    data-element-id="risk-assessment-reasons"
                    className="list list-bullet c-reasons-list"
                  >
                    {healthAssessment.outcome === 'single cell' && (
                      <li>The healthcare assessment recommends a single cell</li>
                    )}
                    {reasons.map(item => (
                      <li key={item.questionId}>
                        <span className="u-d-block">{item.reason}</span>
                        <span className="u-d-block">
                          {riskAssessment.questions[item.questionId]['reasons-yes'] &&
                            `“${riskAssessment.questions[item.questionId]['reasons-yes']}”`}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        <div data-element-id="risk-assessment-summary">
          <RiskAssessmentSummaryTable assessmentComplete title="Cell violence assessment" />
        </div>

        <div data-element-id="health-summary" className="u-margin-bottom-alpha">
          <HealthcareSummaryTable assessmentComplete title="Healthcare assessment" />
        </div>

        <h3 className="heading-medium">What happens next?</h3>
        <p>
          <span>You must print a copy of this outcome for the wing file.</span>
          <span className="u-spacing-right" />
          <button
            type="button"
            className="c-icon-button link u-print-hide"
            onClick={() => window.print()}
          >
            Print Page
          </button>
        </p>
        <p className="u-margin-bottom-bravo">
          You must explain this outcome to the prisoner so that they understand it.
        </p>

        {alreadyCompleted ? (
          <button
            className="button"
            type="button"
            data-element-id="continue-button"
            to={routes.DASHBOARD}
            onClick={onReturnHome}
          >
            Return to Dashboard
          </button>
        ) : (
          <form onSubmit={onReturnHome}>
            <div className="u-clear-fix u-margin-bottom-charlie">
              <SelectableInput
                required
                type="checkbox"
                id="confirmation"
                value="accepted"
                text="The prisoner is aware of the outcome of this risk assessment"
                name="confirmation"
              />
            </div>

            <button className="button" type="submit" data-element-id="continue-button">
              Return to Dashboard
            </button>
          </form>
        )}
      </div>
    );
  }

  render() {
    const { title, riskAssessment, healthAssessment } = this.props;
    const assessmentIsAvailable = not(isEmpty(riskAssessment)) && not(isEmpty(healthAssessment));

    return (
      <DocumentTitle title={title}>
        <div>{assessmentIsAvailable && this.renderFullOutcome()}</div>
      </DocumentTitle>
    );
  }
}

FullAssessmentOutcome.propTypes = {
  riskAssessment: PropTypes.object,
  healthAssessment: PropTypes.object,
  title: PropTypes.string,
  prisoner: PropTypes.shape({
    id: PropTypes.number,
    forename: PropTypes.string,
    dateOfBirth: PropTypes.string,
    nomisId: PropTypes.string,
    surname: PropTypes.string,
  }),
  gotToErrorPage: PropTypes.func,
  storeRiskAssessment: PropTypes.func,
  storeHealthcareAssessment: PropTypes.func,
  storeOutcome: PropTypes.func,
  alreadyCompleted: PropTypes.bool,
  onReturnHome: PropTypes.func,
};

FullAssessmentOutcome.defaultProps = {
  title: 'Assessment Outcome',
  prisoner: {},
  storeOutcome: () => {},
  onReturnHome: () => {},
  storeRiskAssessment: () => {},
  storeHealthcareAssessment: () => {},
  gotToErrorPage: () => {},
  alreadyCompleted: false,
  riskAssessment: {},
  healthAssessment: {},
};

const mapStateToProps = (state, ownProps) => {
  const selectedOffender = state.offender.selected;

  return {
    ...ownProps,
    prisoner: selectedOffender,
    riskAssessment: path([selectedOffender.id], state.assessments.risk),
    healthAssessment: path([selectedOffender.id], state.assessments.healthcare),
    alreadyCompleted: !!selectedOffender.outcome,
  };
};

const mapActionsToProps = dispatch => ({
  gotToErrorPage: () => dispatch(replace(routes.ERROR_PAGE)),
  storeRiskAssessment: ({ id, assessment }) => dispatch(storeRiskAssessmentFor({ id, assessment })),
  storeHealthcareAssessment: ({ id, assessment }) =>
    dispatch(storeHealthcareAssessmentFor({ id, assessment })),
  onReturnHome: () => dispatch(replace(routes.DASHBOARD)),
  storeOutcome: ({ outcome, assessmentId }) => {
    saveAssessmentsOutcome({ outcome, assessmentId }, (response) => {
      if (not(response)) {
        return dispatch(replace(routes.ERROR_PAGE));
      }

      return false;
    });
  },
});

export default connect(mapStateToProps, mapActionsToProps)(FullAssessmentOutcome);
