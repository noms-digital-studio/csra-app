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

class FullAssessmentOutcome extends Component {
  componentDidMount() {
    const { prisoner, storeRiskAssessment, storeHealthcareAssessment, gotToErrorPage } = this.props;

    getAssessmentsById(prisoner.id, (response) => {
      if (not(response)) {
        return gotToErrorPage();
      }

      const riskAssessment = JSON.parse(response.riskAssessment);
      const healthcareAssessment = JSON.parse(response.healthAssessment);

      storeRiskAssessment({ id: prisoner.id, assessment: riskAssessment });
      storeHealthcareAssessment({ id: prisoner.id, assessment: healthcareAssessment });
    });
  }

  renderFullOutcome() {
    const {
      prisoner,
      riskAssessment,
      healthAssessment,
      alreadyCompleted,
      onSubmit,
      onReturnHome,
    } = this.props;

    const finalOutcome = cellAssignment({
      healthcare: {
        sharedCell: healthAssessment.outcome === 'shared cell',
      },
      riskAssessment: {
        sharedCell: /shared cell/.test(riskAssessment.outcome),
        conditions: riskAssessment.outcome === 'shared cell with conditions',
      },
    });

    return (
      <div>
        <div className="grid-row">
          <div className="column-two-thirds">
            <h1 data-title="full-outcome" className="heading-xlarge">
              Risk and healthcare assessment outcome
            </h1>
          </div>
          <div className="column-one-third">
            <div className="c-print-link u-text-align-right">
              <button type="button" className="c-icon-button link" onClick={() => window.print()}>
                Print Page
              </button>
            </div>
          </div>
        </div>

        <div className="u-margin-bottom-bravo">
          <PrisonerProfile {...prisoner} />
        </div>

        <div className="panel panel-border-wide">
          <h3 className="heading-large" data-element-id="recommended-outcome">
            Recommended outcome: {capitalize(finalOutcome)}
          </h3>
          {riskAssessment.reasons &&
            <ul data-element-id="reasons" className="list list-bullet">
              {riskAssessment.reasons.map((item, index) =>
                <li key={index}>
                  {item.reason}
                </li>,
              )}
            </ul>}
        </div>

        <div data-element-id="risk-assessment-summary">
          <RiskAssessmentSummaryTable title="Risk assessment summary" />
        </div>

        <div data-element-id="health-summary" className="u-margin-bottom-bravo">
          <HealthcareSummaryTable title="Healthcare assessment summary" />
        </div>

        {alreadyCompleted
          ? <button
            className="button"
            type="button"
            data-element-id="continue-button"
            to={routes.DASHBOARD}
            onClick={onReturnHome}
          >
              Return to Dashboard
            </button>
          : <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit({ assessmentId: prisoner.id, outcome: finalOutcome });
            }}
          >
            <div className="u-clear-fix u-margin-bottom-charlie">
              <SelectableInput
                required
                type="checkbox"
                id="confirmation"
                value="accepted"
                text="The outcome has been explained and the prisoner understands."
                name="confirmation"
              />
            </div>

            <button className="button" type="submit" data-element-id="continue-button">
                Complete Assessment
              </button>
          </form>}
      </div>
    );
  }

  render() {
    const { title, riskAssessment, healthAssessment } = this.props;
    const assessmentIsAvailable = not(isEmpty(riskAssessment)) && not(isEmpty(healthAssessment));

    return (
      <DocumentTitle title={title}>
        <div>
          {assessmentIsAvailable && this.renderFullOutcome()}
        </div>
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
  storeRiskAssessment: PropTypes.func,
  storeHealthcareAssessment: PropTypes.func,
  onSubmit: PropTypes.func,
  alreadyCompleted: PropTypes.bool,
  onReturnHome: PropTypes.func,
};

FullAssessmentOutcome.defaultProps = {
  title: 'Assessment Outcome',
  prisoner: {},
  onSubmit: () => {},
  onReturnHome: () => {},
  storeRiskAssessment: () => {},
  storeHealthcareAssessment: () => {},
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
  onSubmit: ({ outcome, assessmentId }) => {
    saveAssessmentsOutcome({ outcome, assessmentId }, (response) => {
      if (not(response)) {
        return dispatch(replace(routes.ERROR_PAGE));
      }

      return dispatch(replace(routes.FULL_ASSESSMENT_COMPLETE));
    });
  },
});

export default connect(mapStateToProps, mapActionsToProps)(FullAssessmentOutcome);
