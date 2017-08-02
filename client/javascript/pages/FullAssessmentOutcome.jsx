import React, { PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';
import not from 'ramda/src/not';
import isEmpty from 'ramda/src/isEmpty';

import { cellAssignment } from '../services';
import saveAssessmentsOutcome from '../services/saveAssessmentsOutcome';

import { capitalize } from '../utils';

import PrisonerProfile from '../components/PrisonerProfile';
import RiskAssessmentSummaryTable
  from '../components/connected/RiskAssessmentSummaryTable';
import HealthcareSummaryTable
  from '../components/connected/HealthcareSummaryTable';
import SelectableInput from '../components/SelectableInput';

import routes from '../constants/routes';

const FullAssessmentOutcome = ({
  title,
  prisoner,
  riskAssessmentOutcome,
  healthcareOutcome,
  alreadyCompleted,
  onSubmit,
  onReturnHome,
}) => {
  const finalOutcome = cellAssignment({
    healthcare: {
      sharedCell: healthcareOutcome.recommendation === 'shared cell',
    },
    riskAssessment: {
      sharedCell: (/shared cell/).test(
        riskAssessmentOutcome.recommendation,
      ),
      conditions: riskAssessmentOutcome.recommendation ===
        'shared cell with conditions',
    },
  });

  return (
    <DocumentTitle title={title}>
      <div>
        <div className="grid-row">
          <div className="column-two-thirds">
            <h1 data-title="full-outcome" className="heading-xlarge">
              Risk and healthcare assessment outcome
            </h1>
          </div>
          <div className="column-one-third">
            <div className="c-print-link u-text-align-right">
              <button
                type="button"
                className="c-icon-button link"
                onClick={() => window.print()}
              >
                Print Page
              </button>
            </div>
          </div>
        </div>

        <div className="u-margin-bottom-bravo">
          <PrisonerProfile {...prisoner} />
        </div>

        <div className="panel panel-border-wide">
          <h3 className="heading-large" data-element-id="recommended-outcome">Recommended outcome: {capitalize(finalOutcome)}</h3>
          {not(isEmpty(riskAssessmentOutcome.reasons)) &&
            <ul data-element-id="reasons" className="list list-bullet">
              {riskAssessmentOutcome.reasons.map((reason, index) => (
                <li key={index}>{reason}</li>
              ))}
            </ul>}
        </div>

        <div data-risk-summary>
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
    </DocumentTitle>
  );
};

FullAssessmentOutcome.propTypes = {
  title: PropTypes.string,
  prisoner: PropTypes.shape({
    id: PropTypes.number,
    forename: PropTypes.string,
    dateOfBirth: PropTypes.string,
    nomisId: PropTypes.string,
    surname: PropTypes.string,
  }),
  onSubmit: PropTypes.func,
  riskAssessmentOutcome: PropTypes.shape({
    recommendation: PropTypes.string,
  }),
  healthcareOutcome: PropTypes.shape({
    recommendation: PropTypes.string,
  }),
  alreadyCompleted: PropTypes.bool,
  onReturnHome: PropTypes.func,
};

FullAssessmentOutcome.defaultProps = {
  title: 'Assessment Outcome',
  prisoner: {},
  onSubmit: () => {},
  riskAssessmentOutcome: {},
  healthcareOutcome: {},
  onReturnHome: () => {},
  alreadyCompleted: false,
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  prisoner: state.offender.selected,
  riskAssessmentOutcome: state.riskAssessmentStatus.completed.find(
    item => item.assessmentId === state.offender.selected.id,
  ),
  healthcareOutcome: state.healthcareStatus.completed.find(
    item => item.assessmentId === state.offender.selected.id,
  ),
  alreadyCompleted: !!state.offender.selected.outcome,
});

const mapActionsToProps = dispatch => ({
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

export default connect(mapStateToProps, mapActionsToProps)(
  FullAssessmentOutcome,
);
