import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';
import path from 'ramda/src/path';
import not from 'ramda/src/not';

import { splitAssessorValues } from '../services';
import { capitalize, parseDate } from '../utils';
import postAssessmentToBackend from '../services/postAssessmentToBackend';
import { completeHealthAnswersFor, saveHealthcareAssessmentOutcome } from '../actions';

import PrisonerProfile from '../components/PrisonerProfile';

import routes from '../constants/routes';

class HealthCareSummary extends Component {
  componentDidMount() {
    const { markAnswersAsCompleteFor, saveOutcome, prisoner, answers } = this.props;
    const riskText = { no: 'shared cell', yes: 'single cell' };

    markAnswersAsCompleteFor({ assessmentId: this.props.prisoner.id });
    saveOutcome({ id: prisoner.id, outcome: riskText[answers.outcome.answer] });
  }

  render() {
    const { prisoner, answers, title, assessment, riskAssessmentComplete, onSubmit } = this.props;

    const assessor = splitAssessorValues(answers.assessor.answer);

    return (
      <DocumentTitle title={title}>
        <form
          id="hc-form"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit({
              riskAssessmentComplete,
              assessmentId: prisoner.id,
              assessment,
            });
          }}
        >
          <h1 className="heading-xlarge">Healthcare assessment summary</h1>

          <div className="u-margin-bottom-bravo">
            <PrisonerProfile {...prisoner} />
          </div>

          <div className="panel panel-border-wide">
            <h3 className="heading-large" data-element-id="healthcare-outcome">
              Healthcare recommendation: {capitalize(assessment.outcome)}
            </h3>
          </div>

          <table className="check-your-answers u-margin-bottom-charlie">
            <thead>
              <tr>
                <th colSpan="3">
                  <h2 className="heading-medium">Assessment summary</h2>
                </th>
              </tr>
            </thead>

            <tbody>
              <tr data-healthcare-assessor>
                <td>Assessment Completed by:</td>
                <td>
                  <span data-element-id="healthcare-assessor">
                    {capitalize(assessor.fullName)}
                    <br />
                  </span>
                  <span data-element-id="healthcare-role">
                    {capitalize(assessor.role)}
                    <br />
                  </span>
                  <span data-element-id="healthcare-date">
                    {parseDate(new Date(assessor.year, assessor.month - 1, assessor.day))}
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
              <tr>
                <td>Does Healthcare recommend a single cell?</td>
                <td>
                  <span data-element-id="healthcare-recommendation">
                    {capitalize(answers.outcome.answer)}
                  </span>
                </td>
                <td className="change-answer">
                  <Link to={`${routes.HEALTHCARE_ASSESSMENT}/outcome`} data-change-outcome-link>
                    Change <span className="visuallyhidden">healthcare recommendation</span>
                  </Link>
                </td>
              </tr>
              <tr>
                <td>Comments from the healthcare form:</td>
                <td>
                  <span data-element-id="healthcare-comments">
                    {capitalize(answers.comments.answer || 'none')}
                  </span>
                </td>
                <td className="change-answer">
                  <Link
                    to={`${routes.HEALTHCARE_ASSESSMENT}/comments`}
                    data-element-id="healthcare-change-comments-link"
                  >
                    Change <span className="visuallyhidden">further comments</span>
                  </Link>
                </td>
              </tr>
              <tr>
                <td>Have they given consent to share their medical information?</td>
                <td>
                  <span data-element-id="healthcare-consent">
                    {capitalize(answers.consent.answer)}
                  </span>
                </td>
                <td className="change-answer">
                  <Link
                    to={`${routes.HEALTHCARE_ASSESSMENT}/consent`}
                    data-element-id="healthcare-change-consent-link"
                  >
                    Change <span className="visuallyhidden">consent to share information</span>
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="form-group" data-summary-next-steps>
            {riskAssessmentComplete
              ? null
              : <div className="u-margin-bottom-charlie">
                <h3 className="heading-medium">What happens next?</h3>
                <p>
                    You must now complete the risk assessment questions to get a cell sharing
                    outcome.
                  </p>
              </div>}

            <div className="notice c-notice u-clear-fix">
              <i className="icon icon-important">
                <span className="visually-hidden">Warning</span>
              </i>
              <strong className="bold-small">Once submitted you cannot change these answers</strong>
            </div>

            <button type="submit" className="button" data-element-id="continue-button">
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
  assessment: PropTypes.object,
  prisoner: PropTypes.object,
  answers: PropTypes.object,
  riskAssessmentComplete: PropTypes.bool,
  markAnswersAsCompleteFor: PropTypes.func,
  onSubmit: PropTypes.func,
  saveOutcome: PropTypes.func,
  viperScore: PropTypes.object,
};

HealthCareSummary.defaultProps = {
  title: 'Healthcare Summary',
  markAnswersAsCompleteFor: () => {},
  onSubmit: () => {},
  saveOutcome: () => {},
};

const mapStateToProps = (state, ownProps) => {
  const selectedOffender = state.offender.selected;
  const healthcareAssessment = state.assessments.healthcare;

  return {
    ...ownProps,
    assessment: path([selectedOffender.id], healthcareAssessment),
    prisoner: selectedOffender,
    answers: path([selectedOffender.id, 'questions'], healthcareAssessment),
    riskAssessmentComplete: selectedOffender.riskAssessmentCompleted,
    viperScore: path([selectedOffender.id, 'viperScore'], healthcareAssessment),
  };
};
const mapActionsToProps = dispatch => ({
  saveOutcome: ({ id, outcome }) => dispatch(saveHealthcareAssessmentOutcome({ id, outcome })),
  onSubmit: ({ assessmentId, riskAssessmentComplete, assessment }) => {
    postAssessmentToBackend({ assessmentId, assessmentType: 'health', assessment }, (response) => {
      if (not(response)) {
        return dispatch(replace(routes.ERROR_PAGE));
      }

      if (riskAssessmentComplete) {
        return dispatch(replace(routes.FULL_ASSESSMENT_OUTCOME));
      }

      return dispatch(replace(routes.DASHBOARD));
    });
  },
  markAnswersAsCompleteFor: profile => dispatch(completeHealthAnswersFor(profile)),
});

export default connect(mapStateToProps, mapActionsToProps)(HealthCareSummary);
