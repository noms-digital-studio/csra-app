import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Link } from 'react-router';

import isEmpty from 'ramda/src/isEmpty';
import not from 'ramda/src/not';

import { getViperScores, selectOffender } from '../actions';
import { todaysDate } from '../utils';

import routes from '../constants/routes';

class Dashboard extends Component {
  componentDidMount() {
    this.props.getViperScores();
  }

  renderProfiles() {
    return this.props.profiles.map(profile => (
      <tr data-profile-row={profile.nomisId} key={profile.nomisId}>
        <td>
          <span className="c-profile-holder" />
        </td>
        <td>{profile.firstName} {profile.surname}</td>
        <td>{profile.nomisId}</td>
        <td>{profile.dob}</td>
        <td data-assessment-complete={not(isEmpty(profile.assessmentCompleted))}>
          {isEmpty(profile.assessmentCompleted)
            ? <a onClick={() => this.props.onOffenderSelect(profile)} className="link u-link" data-start-csra-link={profile.nomisId}>
                Start
              </a>
            : <span>Complete</span>}
        </td>
        <td data-health-assessment-complete={not(isEmpty(profile.healthAssessmentCompleted))}>
          {isEmpty(profile.healthAssessmentCompleted)
            ? <a onClick={() => this.props.onOffenderHealthcareSelect(profile)} className="link u-link">
                Start
              </a>
            : <span>Complete</span>}
        </td>
        <td
          data-cell-recommendation={profile.assessmentCompleted.recommendation}
          className="u-text-align-center"
        >
          {isEmpty(profile.assessmentCompleted)
            ? <span className="c-status-indicator" />
            : <span className="">{profile.assessmentCompleted.recommendation}</span>}

        </td>
      </tr>
    ));
  }

  render() {
    return (
      <div>
        <div className="c-dashboard-header">
          <div className="grid-row">
            <div className="column-one-half">
              <Link to={routes.ADD_OFFENDER} className="button" data-add-prisoner-button>Add a prisoner</Link>
            </div>
            <div className="column-one-half u-text-align-right">
            </div>
          </div>
        </div>
        <div className="c-date-title">
          <h1 className="heading-large">
            <span className="heading-secondary">Prisoners to assess on:</span>
            {this.props.date}
          </h1>
        </div>

        {isEmpty(this.props.profiles)
          ? <div className="u-text-align-center">
            <h2 className="heading-large">
                There are no prisoners to assess. Add a prisoner button
              </h2>
          </div>
          : <table data-prisoner-table>
            <thead>
              <tr>
                <th scope="col"></th>
                <th scope="col">Name</th>
                <th scope="col">NOMIS ID</th>
                <th scope="col">DOB</th>
                <th scope="col">Assessment</th>
                <th scope="col">Healthcare</th>
                <th className="u-text-align-center" scope="col">Cell sharing outcome</th>
                <th scope="col" />
              </tr>
            </thead>
            <tbody>
              {this.renderProfiles()}
            </tbody>
          </table>}

      </div>
    );
  }
}

const mapStateToProps = state => ({
  profiles: state.offender.profiles.map(profile => ({
    ...profile,
    healthAssessmentCompleted: state.healthcareStatus.completed.find(
      assessment => assessment.nomisId === profile.nomisId,
    ) || {},
    assessmentCompleted: state.assessmentStatus.completed.find(
      assessment => assessment.nomisId === profile.nomisId,
    ) || {},
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
  profiles: PropTypes.arrayOf(
    PropTypes.shape({
      nomisId: PropTypes.string,
      surname: PropTypes.string,
      firstName: PropTypes.string,
      dob: PropTypes.string,
      assessmentCompleted: PropTypes.object,
      healthAssessmentCompleted: PropTypes.object,
    }),
  ),
  getViperScores: PropTypes.func,
  onOffenderSelect: PropTypes.func,
  date: PropTypes.string,
};

Dashboard.defaultProps = {
  getViperScores: () => {},
  onOffenderSelect: () => {},
  profiles: [],
  date: todaysDate(),
};

export { Dashboard };

export default connect(mapStateToProps, mapActionsToProps)(Dashboard);
