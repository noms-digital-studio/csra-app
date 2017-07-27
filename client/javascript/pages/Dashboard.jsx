import React, { Component, PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Link } from 'react-router';
import isEmpty from 'ramda/src/isEmpty';

import { selectOffender, getOffenderAssessments } from '../actions';
import { parseDate, capitalize, extractDateFromString } from '../utils';
import getAssessments from '../services/getAssessments';


import routes from '../constants/routes';

class Dashboard extends Component {
  componentDidMount() {
    this.props.getOffenderAssessments();
  }

  renderProfiles() {
    return this.props.assessments.map(profile => (
      <tr
        data-element-id={`profile-row-${profile.nomisId}`}
        key={profile.id}
        data-assessment-id={profile.id}
        data-assessments-complete={profile.healthAssessmentCompleted && profile.riskAssessmentCompleted}
      >
        <td>
          <span className="c-profile-holder" />
        </td>
        <td>{profile.forename} {profile.surname}</td>
        <td>{profile.nomisId}</td>
        <td>{extractDateFromString(profile.dateOfBirth)}</td>
        <td
          data-risk-assessment-complete={profile.riskAssessmentCompleted}
        >
          {profile.riskAssessmentCompleted
            ? <span>Complete</span>
            : <button
              type="button"
              onClick={() => this.props.onOffenderSelect(profile)}
              className="link u-link"
              data-element-id={`start-csra-link-${profile.nomisId}`}
            >
              Start
            </button>
          }
        </td>
        <td
          data-health-assessment-complete={profile.healthAssessmentCompleted}
        >
          {profile.healthAssessmentCompleted
            ? <span>Complete</span>
            : <button
              type="button"
              onClick={() => this.props.onOffenderHealthcareSelect(profile)}
              className="link u-link"
              data-element-id={`start-healthcare-link-${profile.nomisId}`}
            >
              Start
            </button>
          }
        </td>
        <td
          className="u-text-align-center"
        >
          {profile.outcome
            ? <span>{capitalize(profile.outcome)}</span>
            : <span className="c-status-indicator" />}

        </td>
        <td data-element-id="view-outcome" className="u-text-align-center">
          {profile.outcome
            ? <span>
              <button
                className="link u-link"
                onClick={() => this.props.onViewOutcomeClick(profile)}
                data-element-id={`view-outcome-link-${profile.nomisId}`}
              >
                View
              </button>
            </span>
            : <span />}
        </td>
      </tr>
    ));
  }

  render() {
    return (
      <DocumentTitle title={this.props.title}>
        <div>
          {isEmpty(this.props.assessments)
            ? <div className="u-text-align-center">
              <h1 className="heading-large">
                <span>There is no one to assess.</span>
              </h1>
              <Link
                to={routes.ADD_OFFENDER}
                className="button"
                data-element-id="continue-button"
              >
                Add someone to assess
              </Link>
            </div>
            : <div>
              <div className="c-dashboard-header">
                <div className="grid-row">
                  <div className="column-one-half">
                    <Link
                      to={routes.ADD_OFFENDER}
                      className="button"
                      data-element-id="continue-button"
                    >
                        Add someone to assess
                      </Link>
                  </div>
                  <div className="column-one-half u-text-align-right" />
                </div>
              </div>
              <div className="c-date-title">
                <h1 data-title="dashboard" className="heading-large">
                  <span className="heading-secondary">
                      Assessments on:
                    </span>
                  {this.props.date}
                </h1>
              </div>

              <table className="c-table-vam">
                <thead>
                  <tr>
                    <th scope="col" />
                    <th scope="col">Name</th>
                    <th scope="col">NOMIS ID</th>
                    <th scope="col">DOB</th>
                    <th scope="col">Assessment</th>
                    <th scope="col">Healthcare</th>
                    <th className="u-text-align-center" scope="col">
                        Cell sharing outcome
                      </th>
                    <th scope="col">&nbsp;</th>
                  </tr>
                </thead>
                <tbody>
                  {this.renderProfiles()}
                </tbody>
              </table>
            </div>}
        </div>
      </DocumentTitle>
    );
  }
}

const mapStateToProps = state => ({
  assessments: state.offender.assessments,
});

const mapActionsToProps = dispatch => ({
  getOffenderAssessments: () => {
    getAssessments((assessments) => {
      if (assessments) {
        dispatch(getOffenderAssessments(assessments));
      }
    });
  },
  onOffenderSelect: (offender) => {
    dispatch(selectOffender(offender));
    dispatch(push(routes.PRISONER_PROFILE));
  },
  onOffenderHealthcareSelect: (offender) => {
    dispatch(selectOffender(offender));
    dispatch(push(`${routes.HEALTHCARE_ASSESSMENT}/outcome`));
  },
  onViewOutcomeClick: (offender) => {
    dispatch(selectOffender(offender));
    dispatch(push(`${routes.FULL_ASSESSMENT_OUTCOME}`));
  },
});

Dashboard.propTypes = {
  title: PropTypes.string,
  assessments: PropTypes.arrayOf(
    PropTypes.shape({
      nomisId: PropTypes.string,
      surname: PropTypes.string,
      forename: PropTypes.string,
      dateOfBirth: PropTypes.string,
      riskAssessmentCompleted: PropTypes.bool,
      healthAssessmentCompleted: PropTypes.bool,
      outcome: PropTypes.string,
    }),
  ),
  getOffenderAssessments: PropTypes.func,
  onOffenderHealthcareSelect: PropTypes.func,
  onOffenderSelect: PropTypes.func,
  onViewOutcomeClick: PropTypes.func,
  date: PropTypes.string,
};

Dashboard.defaultProps = {
  title: 'Dashboard',
  getOffenderAssessments: () => {},
  onOffenderHealthcareSelect: () => {},
  onOffenderSelect: () => {},
  onViewOutcomeClick: () => {},
  assessments: [],
  date: parseDate(new Date()),
};

export { Dashboard };

export default connect(mapStateToProps, mapActionsToProps)(Dashboard);
