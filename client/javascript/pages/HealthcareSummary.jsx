import React, { Component } from 'react';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';
import { completeHealthAssessmentFor } from '../actions';
import path from 'ramda/src/path';
import routes from '../constants/routes';
import { Link } from 'react-router';

class HealthCareSummary extends Component {

  render() {
    const {prisoner, answers} = this.props
    const riskText = {no: 'Shared cell', yes: 'Single cell'};
    window.answers = answers;
    return (

      <div>
        <h1 className="heading-xlarge">Healthcare assessment completed</h1>
        <p></p>

        <div data-profile>
          <h2 className="heading-medium">Prisoner details</h2>
          <p>Prisoner name: <strong className="heading-small">{prisoner.firstName} {prisoner.surname}</strong></p>
          <p>Date of birth: <strong className="heading-small">{prisoner.dob}</strong></p>
          <p>NOMIS ID: <strong className="heading-small">{prisoner.nomisId}</strong></p>
        </div>

        <table className="check-your-answers">

          <thead>
          <tr>
            <th colSpan="2">
              <h2 className="heading-medium">
                Healthcare outcome
              </h2>
            </th>
            <th>
            </th>
          </tr>
          </thead>

          <tbody>
          <tr data-healthcare-outcome>
            <td>
              Recommendation
            </td>
            <td className="u-text-capitalize">
              {riskText[answers.outcome.answer]}
            </td>
            <td className="change-answer">
              <Link to={`${routes.HEALTHCARE_ASSESSMENT}/outcome`}>
                Change <span className="visuallyhidden">healthcare outcome</span>
              </Link>
            </td>
          </tr>
          <tr data-healthcare-comments>
            <td>
              Further Comments
            </td>
            <td className="u-text-capitalize">
              {answers.comments.comments || "none"}
            </td>
            <td className="change-answer">
              <Link to={`${routes.HEALTHCARE_ASSESSMENT}/comments`}>
                Change <span className="visuallyhidden">further comments</span>
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
                Change <span className="visuallyhidden">consent to share information</span>
              </Link>
            </td>
          </tr>
          <tr data-healthcare-assessor>
            <td>
              Completed by
            </td>
            <td className="u-text-capitalize">
              {answers.assessor['full-name']}<br/>
              {answers.assessor.role}<br/>
              {`${answers.assessor['day']}-${answers.assessor['month']}-${answers.assessor['year']}`}
            </td>
            <td className="change-answer">
              <Link to={`${routes.HEALTHCARE_ASSESSMENT}/assessor`}>
                Change <span className="visuallyhidden">completed by</span>
              </Link>
            </td>
          </tr>
          </tbody>
        </table>

        <h2 className="heading-medium"></h2>

        <p className="text"></p>

        <div className="form-group">
          <Link to={routes.HEALTHCARE_COMPLETE} className="button">Save and return to prisoner list</Link>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  prisoner: {
    firstName: state.offender.selected.First_Name,
    surname: state.offender.selected.Surname,
    dob: state.offender.selected.Date_of_Birth,
    nomisId: state.offender.selected.NOMS_Number
  },
  answers: path([state.answers.selectedPrisonerId], state.answers.healthcare),
});

export default connect(mapStateToProps, {
  completeHealthAssessmentFor,
  navigateTo: replace,
})(HealthCareSummary);





