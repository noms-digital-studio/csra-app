import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';
import path from 'ramda/src/path';

import {
  completeHealthAnswersFor,
  completeHealthAssessmentFor,
} from '../actions';

import routes from '../constants/routes';

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
    } = this.props;
    const riskText = { no: 'Shared cell', yes: 'Single cell' };

    return (
      <DocumentTitle title={title}>
        <div>
          <h1 className="heading-xlarge">Healthcare summary</h1>

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
                <th />
              </tr>
            </thead>

            <tbody>
              <tr data-healthcare-outcome>
                <td>
                  Healthcare recommendation:
                </td>
                <td>
                  <span data-outcome>{riskText[answers.outcome.answer]}</span>
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
                    {answers.comments.comments || 'none'}
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
                  Consent given:
                </td>
                <td>
                  <span data-consent>{answers.consent.answer}</span>
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
              <tr data-healthcare-assessor>
                <td>
                  Completed by:
                </td>
                <td>
                  <span data-assessor>
                    {answers.assessor['full-name']}<br />
                  </span>
                  <span data-role>{answers.assessor.role}<br /></span>
                  <span
                    data-date
                  >{`${answers.assessor.day}-${answers.assessor.month}-${answers.assessor.year}`}</span>
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
              onClick={() => onSubmit({ riskAssessmentComplete, prisoner })}
              className="button"
              data-continue-button
            >
              {riskAssessmentComplete
                ? 'Submit and see cell sharing outcome'
                : 'Submit and return to prisoner list'}
            </button>

          </div>
        </div>
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
};

HealthCareSummary.defaultProps = {
  title: 'Healthcare Summary',
  completeHealthAnswersFor: () => {},
  onSubmit: () => {},
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  prisoner: state.offender.selected,
  answers: path([state.answers.selectedPrisonerId], state.answers.healthcare),
  riskAssessmentComplete: !!state.riskAssessmentStatus.completed.find(
    assessment => assessment.nomisId === state.offender.selected.nomisId,
  ),
});

const mapActionsToProps = dispatch => ({
  onSubmit: ({ prisoner, riskAssessmentComplete }) => {
    dispatch(completeHealthAssessmentFor(prisoner));
    if (riskAssessmentComplete) {
      dispatch(replace(routes.FULL_ASSESSMENT_COMPLETE));
    } else {
      dispatch(replace(routes.DASHBOARD));
    }
  },
  completeHealthAnswersFor: profile =>
    dispatch(completeHealthAnswersFor(profile)),
});

export default connect(mapStateToProps, mapActionsToProps)(HealthCareSummary);
