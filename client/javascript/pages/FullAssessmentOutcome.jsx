import React, { PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';

import { cellAssignment } from '../services';
import { capitalize } from '../utils';
import { storeOutcome } from '../actions';

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
  onSubmit,
}) => {
  const finalOutcome = cellAssignment({
    healthcare: {
      sharedCell: healthcareOutcome.recommendation === 'shared cell',
    },
    riskAssessment: {
      sharedCell: new RegExp('shared cell').test(
        riskAssessmentOutcome.recommendation,
      ),
      conditions: riskAssessmentOutcome.recommendation === 'shared cell with conditions',
    },
  });

  return (
    <DocumentTitle title={title}>
      <div>
        <div className="grid-row">
          <div className="column-two-thirds">
            <h1 className="heading-xlarge">
              Risk and healthcare assessment outcome
            </h1>
          </div>
          <div className="column-one-third">
            <div className="c-print-link u-text-align-right">
              <button
                className="c-icon-button link"
                onClick={() => window.print()}
              >
                Print Page
              </button>
            </div>
          </div>
        </div>

        <h2 data-recommended-outcome className="heading-large">
          Recommended outcome: {capitalize(finalOutcome)}
        </h2>

        <div>
          {(riskAssessmentOutcome.reasons && finalOutcome !== 'single cell') &&
            <ul className="list list-bullet">
              {riskAssessmentOutcome.reasons.map((reason, index) => <li key={index}>{reason}</li>)}
            </ul>}
        </div>

        <PrisonerProfile {...prisoner} />

        <div data-risk-summary>
          <RiskAssessmentSummaryTable title="Risk assessment summary" />
        </div>

        <div data-health-summary className="u-margin-bottom-large">
          <HealthcareSummaryTable title="Healthcare assessment summary" />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit({ nomisId: prisoner.nomisId, outcome: finalOutcome });
          }}
        >
          <div className="u-clear-fix u-margin-bottom-medium">
            <SelectableInput
              required
              type="checkbox"
              id="confirmation"
              value="accepted"
              text="The outcome has been explained and the prisoner understands."
              name="confirmation"
            />
          </div>

          <button className="button" data-continue-button>
            Complete Assessment
          </button>
        </form>

      </div>
    </DocumentTitle>
  );
};

FullAssessmentOutcome.propTypes = {
  title: PropTypes.string,
  prisoner: PropTypes.shape({
    firstName: PropTypes.string,
    dob: PropTypes.string,
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
};

FullAssessmentOutcome.defaultProps = {
  title: 'Assessment Outcome',
  prisoner: {},
  onSubmit: () => {}
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  prisoner: state.offender.selected,
  riskAssessmentOutcome: state.riskAssessmentStatus.completed.find(
    item => item.nomisId === state.offender.selected.nomisId,
  ),
  healthcareOutcome: state.healthcareStatus.completed.find(
    item => item.nomisId === state.offender.selected.nomisId,
  ),
});

const mapActionsToProps = dispatch => ({
  onSubmit: (outcome) => {
    dispatch(storeOutcome(outcome));
    dispatch(replace(routes.FULL_ASSESSMENT_COMPLETE));
  },
});

export default connect(mapStateToProps, mapActionsToProps)(
  FullAssessmentOutcome,
);
