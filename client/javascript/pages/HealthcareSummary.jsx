import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';
import path from 'ramda/src/path';

import { capitalize, parseDate } from '../utils';

import postAssessmentToBackend from '../services/postAssessmentToBackend';

import {
  completeHealthAnswersFor,
  completeHealthAssessmentFor,
} from '../actions';

import routes from '../constants/routes';

const joinAssessorValues = accessor =>
  `${accessor.role}, ${accessor['full-name']}, ${accessor.day}-${accessor.month}-${accessor.year}`;

const normalizeAssessorAnswerIn = answers =>
  Object.keys(answers).reduce((acc, key) => {
    if (key === 'assessor') {
      return { ...acc, [key]: { answer: joinAssessorValues(answers[key]) } };
    }
    return { ...acc, [key]: answers[key] };
  }, {});

class HealthCareSummary extends Component {
  componentDidMount() {
    this.props.completeHealthAnswersFor(this.props.prisoner);
  }

  render() {
    const {
      prisoner,
      answers,
      title,
      riskAssessmentComplete,
      onSubmit,
      viperScore,
      questions,
    } = this.props;
    const riskText = { no: 'shared cell', yes: 'single cell' };

    return (
      <DocumentTitle title={title}>
        <form
          id="hc-form"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit({
              riskAssessmentComplete,
              prisoner: {
                recommendation: riskText[answers.outcome.answer],
                nomisId: prisoner.nomisId,
              },
              postData: {
                nomisId: prisoner.nomisId,
                outcome: riskText[answers.outcome.answer],
                viperScore: viperScore.viperScore,
                questions,
                answers: normalizeAssessorAnswerIn(answers),
              },
            });
          }}
        >
          <h1 className="heading-xlarge">Healthcare assessment summary</h1>

          <div className="o-offender-profile u-clear-fix">
            <div className="c-offender-image">
              <img src="/assets/images/profile-placeholder.gif" />
            </div>
            <div
              data-offender-profile-details
              className="c-offender-details"
            >
              <table>
                <tbody>
                  <tr>
                    <th colSpan="2">Prisoner Details</th>
                  </tr>
                  <tr>
                    <td>Full name</td>
                    <td data-prisoner-name>
                      <strong className="heading-small">{prisoner.firstName} {prisoner.surname}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>Date of birth:</td>
                    <td>
                      <strong className="heading-small">{prisoner.dob}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>NOMISID:</td>
                    <td>
                      <strong className="heading-small">{prisoner.nomisId}</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="panel panel-border-wide">
            <h3 className="heading-large">Healthcare recommendation: {capitalize(riskText[answers.outcome.answer])}</h3>
          </div>

          <table className="check-your-answers u-margin-bottom-alpha">
            <thead>
              <tr>
                <th colSpan="3">
                  <h2 className="heading-medium">
                    Assessment summary
                  </h2>
                </th>
              </tr>
            </thead>

            <tbody>
              <tr data-healthcare-assessor>
                <td>
                  Assessment Completed by:
                </td>
                <td>
                  <span data-assessor>
                    {capitalize(answers.assessor['full-name'])}<br />
                  </span>
                  <span data-role>
                    {capitalize(answers.assessor.role)}<br />
                  </span>
                  <span
                    data-date
                  >
                    {parseDate(new Date(answers.assessor.year, answers.assessor.month - 1, answers.assessor.day))}
                  </span>
                </td>
                <td className="change-answer">
                  <Link
                    to={`${routes.HEALTHCARE_ASSESSMENT}/assessor`}
                    data-change-completed-by-link
                  >
                    Change <span className="visuallyhidden">completed by</span>
                  </Link>
                </td>
              </tr>
              <tr data-healthcare-outcome>
                <td>
                  Does Healthcare recommend a single cell?
                </td>
                <td>
                  <span data-outcome>
                    {capitalize(answers.outcome.answer)}
                  </span>
                </td>
                <td className="change-answer">
                  <Link
                    to={`${routes.HEALTHCARE_ASSESSMENT}/outcome`}
                    data-change-outcome-link
                  >
                    Change
                    {' '}
                    <span className="visuallyhidden">healthcare outcome</span>
                  </Link>
                </td>
              </tr>
              <tr data-healthcare-comments>
                <td>
                  Comments from the healthcare form:
                </td>
                <td>
                  <span data-comments>
                    {capitalize(answers.comments.comments || 'none')}
                  </span>
                </td>
                <td className="change-answer">
                  <Link
                    to={`${routes.HEALTHCARE_ASSESSMENT}/comments`}
                    data-change-comments-link
                  >
                    Change
                    {' '}
                    <span className="visuallyhidden">further comments</span>
                  </Link>
                </td>
              </tr>
              <tr data-healthcare-consent>
                <td>
                  Have they given consent to share their medical information?
                </td>
                <td>
                  <span data-consent>{capitalize(answers.consent.answer)}</span>
                </td>
                <td className="change-answer">
                  <Link
                    to={`${routes.HEALTHCARE_ASSESSMENT}/consent`}
                    data-change-consent-link
                  >
                    Change
                    {' '}
                    <span className="visuallyhidden">
                      consent to share information
                    </span>
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="form-group" data-summary-next-steps>
            <div className="notice c-notice u-clear-fix">
              <i className="icon icon-important">
                <span className="visually-hidden">Warning</span>
              </i>
              <strong className="bold-small">
                Once submitted you cannot change these answers
              </strong>
            </div>

            {riskAssessmentComplete
              ? null
              : <p className="u-margin-bottom-medium">
                You must now complete the risk assessment questions to get a cell sharing outcome.
                </p>}

            <button
              type="submit"
              className="button"
              data-continue-button
            >
              {riskAssessmentComplete
                ? 'Submit and see cell sharing outcome'
                : 'Submit and return to prisoner list'}
            </button>

          </div>
        </form>
      </DocumentTitle>
    );
  }
}

HealthCareSummary.propTypes = {
  title: PropTypes.string,
  prisoner: PropTypes.object,
  answers: PropTypes.object,
  riskAssessmentComplete: PropTypes.bool,
  completeHealthAnswersFor: PropTypes.func,
  onSubmit: PropTypes.func,
  viperScore: PropTypes.object,
  questions: PropTypes.array,
};

HealthCareSummary.defaultProps = {
  title: 'Healthcare Summary',
  completeHealthAnswersFor: () => { },
  onSubmit: () => { },
};

const findViperScore = (nomisId, viperScores) =>
  viperScores.find(item => item.nomisId === nomisId) || -1;

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  prisoner: state.offender.selected,
  answers: path([state.answers.selectedPrisonerId], state.answers.healthcare),
  riskAssessmentComplete: !!state.riskAssessmentStatus.completed.find(
    assessment => assessment.nomisId === state.offender.selected.nomisId,
  ),
  viperScore: findViperScore(
    state.offender.selected.nomisId,
    state.offender.viperScores,
  ),
  questions: state.questions.healthcare,
});

const mapActionsToProps = dispatch => ({
  onSubmit: ({ prisoner, riskAssessmentComplete, postData }) => {
    postAssessmentToBackend('healthcare', postData, (assessmentId) => {
      dispatch(
        completeHealthAssessmentFor({
          nomisId: prisoner.nomisId,
          assessmentId,
          recommendation: postData.outcome,
        }),
      );
      if (riskAssessmentComplete) {
        dispatch(replace(routes.FULL_ASSESSMENT_OUTCOME));
      } else {
        dispatch(replace(routes.DASHBOARD));
      }
    });
  },
  completeHealthAnswersFor: profile =>
    dispatch(completeHealthAnswersFor(profile)),
});

export default connect(mapStateToProps, mapActionsToProps)(HealthCareSummary);
