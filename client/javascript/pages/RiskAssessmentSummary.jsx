import React, { PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';
import path from 'ramda/src/path';

import { completeRiskAssessmentFor, clearAnswers } from '../actions';
import { calculateRiskFor as viperScoreFor } from '../services';

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

const renderAnswerWithComments = (question, answer, dataTags) =>
  (answer
    ? <tr {...dataTags}>
      <td className="heading-small">
        {question}
      </td>
      <td>
        <p>{answer.answer}</p>
        {answer[`reasons-${answer.answer}`] &&
        <p data-comments>
          <span className="heading-small u-d-block">
                Comments
              </span>
          <span>
            {answer[`reasons-${answer.answer}`]}
          </span>
        </p>}
      </td>
    </tr>
    : null);

const RiskAssessmentSummary = ({
  title,
  prisoner,
  onSubmit,
  onClear,
  outcome,
  healthcareAssessmentComplete,
  answers,
}) => (
  <DocumentTitle title={title}>
    <div>
      <h1 className="heading-xlarge">Risk assessment summary</h1>

      <div data-profile>
        <h2 className="heading-medium">Prisoner Details</h2>
        <p>
          Prisoner Name:
          {' '}
          <strong className="heading-small">
            <span data-prisoner-name>
              {prisoner.firstName} {prisoner.surname}
            </span>
          </strong>
        </p>
        <p>
          Date of Birth:
          {' '}
          <strong className="heading-small">
            <span data-prisoner-dob>{prisoner.dob}</span>
          </strong>
        </p>
        <p>
          NOMIS ID:
          {' '}
          <strong className="heading-small">
            <span data-prisoner-nomis-id>{prisoner.nomisId}</span>
          </strong>
        </p>
      </div>

      <table className="check-your-answers c-answers-table">
        <thead>
          <tr>
            <th colSpan="2">
              <h2 className="heading-medium">
                Assessment summary
              </h2>
            </th>
          </tr>
        </thead>

        <tbody className="c-answers-table-vat">
          <tr data-risk-assessment-outcome>
            <td className="heading-small">
              Initial recommendation:
            </td>
            <td>
              <span data-outcome>{outcome.recommendation}</span>
            </td>
          </tr>
          {answers['how-do-you-feel']
            ? <tr data-risk-assessment-feeling>
              <td className="heading-small">
                  How they feel about sharing a cell:
                </td>
              <td>
                <span data-comments>
                  {answers['how-do-you-feel'].comments || 'No comments'}
                </span>
              </td>
            </tr>
            : null}

          {renderAnswerWithComments(
            'Have they indicated they’d seriously hurt a cellmate:',
            answers['prison-self-assessment'],
            { 'data-risk-assessment-harm': true },
          )}

          {renderAnswerWithComments('Vulnerable:', answers.vulnerability, {
            'data-risk-assessment-vulnerability': true,
          })}

          {renderAnswerWithComments(
            'In a gang, or likely to join one:',
            answers['gang-affiliation'],
            { 'data-risk-assessment-gang': true },
          )}

          {renderAnswerWithComments(
            'Drug or alcohol dependent:',
            answers['drug-misuse'],
            { 'data-risk-assessment-narcotics': true },
          )}

          {renderAnswerWithComments(
            'Hostile or prejudiced views:',
            answers.prejudice,
            { 'data-risk-assessment-prejudice': true },
          )}

          {renderAnswerWithComments(
            'Any other reasons they should have single cell:',
            answers.prejudice,
            { 'data-risk-assessment-officer-comments': true },
          )}

        </tbody>
      </table>

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
      </p>

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
  answers: PropTypes.object,
};

RiskAssessmentSummary.defaultProps = {
  title: 'Risk Assessment Complete',
  outcome: {
    reasons: [],
  },
  prisoner: {},
  onSubmit: () => {},
  answers: {},
  onClear: {},
};

const mapStateToProps = state => ({
  prisoner: state.offender.selected,
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
