import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';
import { completeHealthAnswersFor } from '../actions';
import path from 'ramda/src/path';
import routes from '../constants/routes';
import { Link } from 'react-router';

class HealthCareSummary extends Component {
  componentDidMount() {
    this.props.completeHealthAnswersFor(this.props.prisoner);
  }

  render() {
    const { prisoner, answers } = this.props;
    const riskText = { no: 'no - low risk', yes: 'yes - high risk' };

    return (
      <div>
        <h1 className="heading-xlarge">Healthcare assessment completed</h1>
        <p>The healthcare information has been captured for the prisoner</p>

        <div data-profile>
          <h2 className="heading-medium">Prisoner Details</h2>
          <p>
            Prisoner Name:
            {' '}
            <strong className="heading-small">
              {prisoner.First_Name} {prisoner.Surname}
            </strong>
          </p>
          <p>
            Date of Birth:
            {' '}
            <strong className="heading-small">{prisoner.Date_of_Birth}</strong>
          </p>
          <p>
            Prisoner Number:
            {' '}
            <strong className="heading-small">{prisoner.NOMS_Number}</strong>
          </p>
        </div>

        <table className="check-your-answers">

          <thead>
            <tr>
              <th colSpan="2">
                <h2 className="heading-medium">
                  Healthcare Summary
                </h2>
              </th>
              <th />
            </tr>
          </thead>

          <tbody>
            <tr data-healthcare-outcome>
              <td>
                Healthcare Outcome
              </td>
              <td className="u-text-capitalize">
                {riskText[answers.outcome.answer]}
              </td>
              <td className="change-answer">
                <Link to={`${routes.HEALTHCARE_ASSESSMENT}/outcome`}>
                  Change
                  {' '}
                  <span className="visuallyhidden">healthcare outcome</span>
                </Link>
              </td>
            </tr>
            <tr data-healthcare-comments>
              <td>
                Further Comments
              </td>
              <td className="u-text-capitalize">
                {answers.comments.comments || 'none'}
              </td>
              <td className="change-answer">
                <Link to={`${routes.HEALTHCARE_ASSESSMENT}/comments`}>
                  Change
                  {' '}
                  <span className="visuallyhidden">further comments</span>
                </Link>
              </td>
            </tr>
            <tr data-healthcare-consent>
              <td>
                Consent to share information
              </td>
              <td className="u-text-capitalize">
                {answers.consent.answer}
              </td>
              <td className="change-answer">
                <Link to={`${routes.HEALTHCARE_ASSESSMENT}/consent`}>
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
                Completed by
              </td>
              <td className="u-text-capitalize">
                {answers.assessor['full-name']}<br />
                {answers.assessor.role}<br />
                {`${answers.assessor.day}-${answers.assessor.month}-${answers.assessor.year}`}
              </td>
              <td className="change-answer">
                <Link to={`${routes.HEALTHCARE_ASSESSMENT}/assessor`}>
                  Change <span className="visuallyhidden">completed by</span>
                </Link>
              </td>
            </tr>
          </tbody>
        </table>

        <h2 className="heading-medium">Next steps</h2>

        <p className="text">
          The healthcare assessment has been saved, but the prisoner assessment must still
          be completed before their assessment out come can be made.
        </p>

        <div className="form-group">
          <Link to={routes.HEALTHCARE_COMPLETE} className="button">
            Save and Continue
          </Link>
        </div>
      </div>
    );
  }
}


HealthCareSummary.propTypes = {
  prisoner: PropTypes.object,
  answers: PropTypes.object,
  completeHealthAnswersFor: PropTypes.func,
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  prisoner: state.offender.selected,
  answers: path([state.answers.selectedPrisonerId], state.answers.healthcare),
});

export default connect(mapStateToProps, {
  completeHealthAnswersFor,
})(HealthCareSummary);
