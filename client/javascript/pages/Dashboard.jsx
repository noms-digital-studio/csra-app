import React, { Component, PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Link } from 'react-router';

import path from 'ramda/src/path';
import isEmpty from 'ramda/src/isEmpty';
import not from 'ramda/src/not';

import { getViperScores, selectOffender } from '../actions';
import { parseDate, capitalize } from '../utils';

import routes from '../constants/routes';

class Dashboard extends Component {
  componentDidMount() {
    this.props.getViperScores();
  }

  renderProfiles() {
    return this.props.profiles.map(profile => (
      <tr
        data-profile-row={profile.nomisId}
        key={profile.nomisId}
        data-risk-assessment-id={profile.assessmentCompleted.assessmentId}
        data-health-assessment-id={profile.healthAssessmentCompleted.assessmentId}
      >
        <td>
          <span className="c-profile-holder" />
        </td>
        <td>{profile.firstName} {profile.surname}</td>
        <td>{profile.nomisId}</td>
        <td>{profile.dob}</td>
        <td
          data-assessment-complete={not(isEmpty(profile.assessmentCompleted))}
        >
          {isEmpty(profile.assessmentCompleted)
              ? <a
                onClick={() => this.props.onOffenderSelect(profile)}
                className="link u-link"
                data-start-csra-link={profile.nomisId}
              >
                  Start
                </a>
              : <span>Complete</span>}
        </td>
        <td
          data-health-assessment-complete={not(
              isEmpty(profile.healthAssessmentCompleted),
            )}
        >
          {isEmpty(profile.healthAssessmentCompleted)
              ? <a
                onClick={() => this.props.onOffenderHealthcareSelect(profile)}
                className="link u-link"
                data-start-healthcare-link={profile.nomisId}
              >
                  Start
                </a>
              : <span>Complete</span>}
        </td>
        <td
          data-cell-recommendation={profile.outcome}
          className="u-text-align-center"
        >
          {profile.outcome
              ? <span className="">
                {capitalize(profile.outcome)}
              </span>
              : <span className="c-status-indicator" />}

        </td>
      </tr>
      ));
  }

  render() {
    return (
      <DocumentTitle title={this.props.title}>
        <div>

          {isEmpty(this.props.profiles)
            ? <div className="u-text-align-center">
              <h1 className="heading-large">
                <span>There is no one to assess.</span>
              </h1>
              <Link
                to={routes.ADD_OFFENDER}
                className="button"
                data-add-prisoner-button
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
                      data-add-prisoner-button
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

              <table data-prisoner-table>
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
                    <th scope="col" />
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
  profiles: state.offender.profiles.map(profile => ({
    ...profile,
    healthAssessmentCompleted: state.healthcareStatus.completed.find(
      assessment => assessment.nomisId === profile.nomisId,
    ) || {},
    assessmentCompleted: state.riskAssessmentStatus.completed.find(
      assessment => assessment.nomisId === profile.nomisId,
    ) || {},
    outcome: path([profile.nomisId], state.assessmentOutcomes),
  })),
});

const mapActionsToProps = dispatch => ({
  getViperScores: () => dispatch(getViperScores()),
  onOffenderSelect: (offender) => {
    dispatch(selectOffender(offender));
    dispatch(push(routes.PRISONER_PROFILE));
  },
  onOffenderHealthcareSelect: (offender) => {
    dispatch(selectOffender(offender));
    dispatch(push(`${routes.HEALTHCARE_ASSESSMENT}/outcome`));
  },
});

Dashboard.propTypes = {
  title: PropTypes.string,
  profiles: PropTypes.arrayOf(
    PropTypes.shape({
      nomisId: PropTypes.string,
      surname: PropTypes.string,
      firstName: PropTypes.string,
      dob: PropTypes.string,
      assessmentCompleted: PropTypes.object,
      healthAssessmentCompleted: PropTypes.object,
      outcome: PropTypes.string,
    }),
  ),
  getViperScores: PropTypes.func,
  onOffenderSelect: PropTypes.func,
  date: PropTypes.string,
};

Dashboard.defaultProps = {
  title: 'Dashboard',
  getViperScores: () => {},
  onOffenderSelect: () => {},
  profiles: [],
  date: parseDate(new Date()),
};

export { Dashboard };

export default connect(mapStateToProps, mapActionsToProps)(Dashboard);
