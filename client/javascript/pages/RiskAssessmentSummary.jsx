import React, { PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';
import path from 'ramda/src/path';
import not from 'ramda/src/not';

import { completeRiskAssessmentFor } from '../actions';
import { capitalize } from '../utils';
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
  outcome,
  healthcareAssessmentComplete,
  viperScore,
  answers,
  questions,
}) => (
    <DocumentTitle title={title}>
      <form
        id="rsa-form"
        onSubmit={(e) => {
          e.preventDefault();

          onSubmit({
            healthcareAssessmentComplete,
            outcome,
            assessmentId: prisoner.id,
            viperScore,
            answers,
            questions,
          });
        }}
      >
        <div className="grid-row">
          <div className="column-two-thirds">
            <h1 className="heading-xlarge">Risk assessment summary</h1>
          </div>
          <div className="column-one-third">
            <div className="c-print-link c-print-link--small-mt">
              <button
                className="c-icon-button link"
                type="button"
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
          <h2 className="heading-large" data-element-id="risk-assessment-risk">Cell violence risk: {capitalize(outcome.rating)}</h2>
          <h3 className="heading-medium" data-element-id="risk-assessment-outcome">Allocation recommendation: {capitalize(outcome.recommendation)}</h3>
          {outcome.reasons &&
            <ul data-element-id="risk-assessment-reasons" className="list list-bullet">
              {outcome.reasons.map((reason, index) => (
                <li key={index}>{reason}</li>
              ))}
            </ul>}
        </div>

        <div className="u-margin-bottom-bravo">
          <RiskAssessmentSummaryTable title="Assessment Summary" />
        </div>

        <div className="form-group" data-summary-next-steps>
          {healthcareAssessmentComplete
            ? null :
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
            </div>}

          <div className="notice c-notice u-clear-fix">
            <i className="icon icon-important">
              <span className="visually-hidden">Warning</span>
            </i>
            <strong className="bold-small">
              Once submitted you cannot change these answers
            </strong>
          </div>

          <button
            type="submit"
            className="button"
            data-element-id="continue-button"
          >
            {healthcareAssessmentComplete
              ? 'Submit and complete assessment'
              : 'Submit and return to prisoner list'}
          </button>

        </div>
      </form>
    </DocumentTitle>
  );

RiskAssessmentSummary.propTypes = {
  title: PropTypes.string,
  outcome: PropTypes.shape({
    recommendation: PropTypes.string,
    rating: PropTypes.string,
    reasons: PropTypes.arrayOf(PropTypes.string),
  }),
  onSubmit: PropTypes.func,
  prisoner: PropTypes.shape({
    forename: PropTypes.string,
    dateOfBirth: PropTypes.string,
    nomisId: PropTypes.string,
    surname: PropTypes.string,
  }),
  healthcareAssessmentComplete: PropTypes.bool,
  viperScore: PropTypes.number,
  answers: PropTypes.object,
  questions: PropTypes.array,
};

RiskAssessmentSummary.defaultProps = {
  title: 'Risk Assessment Summary',
  outcome: {
    reasons: [],
  },
  prisoner: {},
  onSubmit: () => { },
};

const findViperScore = (nomisId, viperScores) =>
  viperScores.find(item => item.nomisId === nomisId) || {};

const mapStateToProps = (state) => {
  const viperScore = findViperScore(
    state.offender.selected.nomisId,
    state.offender.viperScores,
  ).viperScore;

  return ({
    prisoner: state.offender.selected,
    cellRecommendation: viperScoreFor(
      state.offender.selected.nomisId,
      state.offender.viperScores,
    ),
    viperScore,
    outcome: extractDecision({
      questions: state.questions.riskAssessment,
      answers: path(
        [state.answers.selectedAssessmentId],
        state.answers.riskAssessment,
      ),
      viperScore,
    }),
    answers: path(
      [state.answers.selectedAssessmentId],
      state.answers.riskAssessment,
    ),
    questions: state.questions.riskAssessment,
    healthcareAssessmentComplete: state.offender.selected.healthAssessmentCompleted,
  });
};

const mapActionsToProps = dispatch => ({
  onSubmit: ({
    healthcareAssessmentComplete,
    outcome,
    viperScore,
    questions,
    answers,
    assessmentId,
  }) => {
    postAssessmentToBackend(
      {
        assessmentId,
        assessmentType: 'risk',
        outcome: outcome.recommendation,
        viperScore,
        questions,
        answers,
      },
      (response) => {
        if (not(response)) {
          return dispatch(replace(routes.ERROR_PAGE));
        }

        dispatch(
          completeRiskAssessmentFor({
            rating: outcome.rating,
            recommendation: outcome.recommendation,
            assessmentId,
            reasons: outcome.reasons,
          }),
        );

        if (healthcareAssessmentComplete) {
          dispatch(replace(routes.FULL_ASSESSMENT_OUTCOME));
        } else {
          dispatch(replace(routes.DASHBOARD));
        }

        return true;
      },
    );
  },
});

export default connect(mapStateToProps, mapActionsToProps)(
  RiskAssessmentSummary,
);
