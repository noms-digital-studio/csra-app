import React, { PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';
import path from 'ramda/src/path';

import { completeRiskAssessmentFor, clearAnswers } from '../actions';
import { calculateRiskFor as viperScoreFor } from '../services';

import PrisonerProfile from '../components/PrisonerProfile';
import RiskAssessmentSummaryTable from '../components/connected/RiskAssessmentSummaryTable';

import routes from '../constants/routes';

const extractDecision = (questions, exitPoint, viperScore) => {
  if (exitPoint) {
    const question = questions.find(item => item.section === exitPoint);
    return {
      recommendation: 'Single cell',
      rating: 'high',
      reasons: question.sharedCellPredicate.reasons,
    };
  }

  if (viperScore === 'unknown') {
    return {
      recommendation: 'Single cell',
      rating: 'unknown',
      reasons: [
        'Based on the fact that a Viper Score was not available for you.',
      ],
    };
  }

  return {
    recommendation: 'Shared cell',
    rating: 'low',
    reasons: [
      'Take into consideration any prejudices and hostile views. Ensure that the nature of these views is taken into account when allocating a cell mate. Inform the keyworker to monitor the impact on other prisoners.',
    ],
  };
};

const RiskAssessmentSummary = ({
  title,
  prisoner,
  onSubmit,
  onClear,
  outcome,
  healthcareAssessmentComplete,
  viperScore,
}) => (
  <DocumentTitle title={title}>
    <div>
      <h1 className="heading-xlarge">Risk assessment summary</h1>

      <PrisonerProfile {...prisoner} />

      <RiskAssessmentSummaryTable title="Assessment Summary" />

      {viperScore !== 'high' &&
        <p className="u-margin-bottom-large">
          <a
            data-change-answers
            className="link u-link"
            onClick={() => {
              onClear(prisoner.nomisId);
            }}
          >
            Change answers
          </a>
        </p>}

      <div className="form-group" data-summary-next-steps>
        <div className="notice c-notice u-clear-fix">
          <i className="icon icon-important">
            <span className="visually-hidden">Warning</span>
          </i>
          <strong className="bold-small">
            Once submitted you cannot change these answers
          </strong>
        </div>

        {healthcareAssessmentComplete
          ? null
          : <p className="u-margin-bottom-medium">
              You must now complete the healthcare questions to get a cell sharing outcome.
            </p>}

        <button
          onClick={() =>
            onSubmit({
              healthcareAssessmentComplete,
              outcome,
              nomisId: prisoner.nomisId,
            })}
          className="button"
          data-continue-button
        >
          {healthcareAssessmentComplete
            ? 'Submit and complete assessment'
            : 'Submit and return to prisoner list'}
        </button>

      </div>
    </div>
  </DocumentTitle>
);

RiskAssessmentSummary.propTypes = {
  viperScore: PropTypes.string,
  outcome: PropTypes.shape({
    recommendation: PropTypes.string,
    rating: PropTypes.string,
    reasons: PropTypes.arrayOf(PropTypes.string),
  }),
  onSubmit: PropTypes.func,
  onClear: PropTypes.func,
  prisoner: PropTypes.shape({
    firstName: PropTypes.string,
    dob: PropTypes.string,
    nomisId: PropTypes.string,
    surname: PropTypes.string,
  }),
  healthcareAssessmentComplete: PropTypes.bool,
};

RiskAssessmentSummary.defaultProps = {
  title: 'Risk Assessment Complete',
  outcome: {
    reasons: [],
  },
  prisoner: {},
  onSubmit: () => {},
  onClear: {},
};

const mapStateToProps = state => ({
  prisoner: state.offender.selected,
  viperScore: viperScoreFor(
    state.offender.selected.nomisId,
    state.offender.viperScores,
  ),
  outcome: extractDecision(
    state.questions.riskAssessment,
    state.riskAssessmentStatus.exitPoint,
    viperScoreFor(state.offender.selected.nomisId, state.offender.viperScores),
  ),
  answers: path(
    [state.answers.selectedPrisonerId],
    state.answers.riskAssessment,
  ),
  healthcareAssessmentComplete: !!state.healthcareStatus.completed.find(
    assessment => assessment.nomisId === state.offender.selected.nomisId,
  ),
});

const mapActionsToProps = dispatch => ({
  onClear: (nomisId) => {
    dispatch(clearAnswers(nomisId));
    dispatch(replace(`${routes.RISK_ASSESSMENT}/introduction`));
  },
  onSubmit: ({ healthcareAssessmentComplete, outcome, nomisId }) => {
    dispatch(completeRiskAssessmentFor({ ...outcome, nomisId }));
    if (healthcareAssessmentComplete) {
      dispatch(replace(routes.FULL_ASSESSMENT_COMPLETE));
    } else {
      dispatch(replace(routes.DASHBOARD));
    }
  },
});

export default connect(mapStateToProps, mapActionsToProps)(
  RiskAssessmentSummary,
);
