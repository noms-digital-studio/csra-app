import React, { PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';
import path from 'ramda/src/path';

import { completeRiskAssessmentFor, clearAnswers } from '../actions';
import {
  calculateRiskFor as viperScoreFor,
  extractDecision,
} from '../services';

import postAssessmentToBackend from '../services/postAssessmentToBackend';

import PrisonerProfile from '../components/PrisonerProfile';
import RiskAssessmentSummaryTable
  from '../components/connected/RiskAssessmentSummaryTable';

import routes from '../constants/routes';

const RiskAssessmentSummary = ({
  title,
  prisoner,
  onSubmit,
  onClear,
  outcome,
  healthcareAssessmentComplete,
  cellRecommendation,
  viperScore,
  answers,
  questions,
}) => (
  <DocumentTitle title={title}>
    <div>
      <h1 className="heading-xlarge">Risk assessment summary</h1>

      <PrisonerProfile {...prisoner} />

      <div className="u-margin-bottom-large">
        <RiskAssessmentSummaryTable title="Assessment Summary" />
      </div>

      {cellRecommendation !== 'high' &&
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
              viperScore: viperScore.viperScore,
              answers,
              questions,
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
  title: PropTypes.string,
  cellRecommendation: PropTypes.string,
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
  title: 'Risk Assessment Summary',
  outcome: {
    reasons: [],
  },
  prisoner: {},
  onSubmit: () => {},
  onClear: {},
};

const findViperScore = (nomisId, viperScores) =>
  viperScores.find(item => item.nomisId === nomisId) || -1;

const mapStateToProps = state => ({
  prisoner: state.offender.selected,
  cellRecommendation: viperScoreFor(
    state.offender.selected.nomisId,
    state.offender.viperScores,
  ),
  viperScore: findViperScore(
    state.offender.selected.nomisId,
    state.offender.viperScores,
  ),
  outcome: extractDecision({
    questions: state.questions.riskAssessment,
    answers: path(
      [state.answers.selectedPrisonerId],
      state.answers.riskAssessment,
    ),
    exitPoint: state.riskAssessmentStatus.exitPoint,
  }),
  answers: path(
    [state.answers.selectedPrisonerId],
    state.answers.riskAssessment,
  ),
  questions: state.questions.riskAssessment,
  healthcareAssessmentComplete: !!state.healthcareStatus.completed.find(
    assessment => assessment.nomisId === state.offender.selected.nomisId,
  ),
});

const mapActionsToProps = dispatch => ({
  onClear: (nomisId) => {
    dispatch(clearAnswers(nomisId));
    dispatch(replace(`${routes.RISK_ASSESSMENT}/introduction`));
  },
  onSubmit: ({
    healthcareAssessmentComplete,
    outcome,
    nomisId,
    viperScore,
    questions,
    answers,
  }) => {
    postAssessmentToBackend(
      'risk',
      {
        nomisId,
        outcome: outcome.recommendation,
        viperScore,
        questions,
        answers,
      },
      (assessmentId) => {
        dispatch(
          completeRiskAssessmentFor({
            recommendation: outcome.recommendation,
            nomisId,
            assessmentId,
            reasons: outcome.reasons,
          }),
        );
        if (healthcareAssessmentComplete) {
          dispatch(replace(routes.FULL_ASSESSMENT_OUTCOME));
        } else {
          dispatch(replace(routes.DASHBOARD));
        }
      },
    );
  },
});

export default connect(mapStateToProps, mapActionsToProps)(
  RiskAssessmentSummary,
);
