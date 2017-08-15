import React, { Component, PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import { push, replace } from 'react-router-redux';
import { Link } from 'react-router';
import isEmpty from 'ramda/src/isEmpty';
import compose from 'ramda/src/compose';
import map from 'ramda/src/map';
import filter from 'ramda/src/filter';

import { getTimeStamp } from '../utils';
import { selectOffender, getOffenderAssessments, startHealthcareAssessmentFor } from '../actions';
import getAssessments from '../services/getAssessments';
import getAssessmentsById from '../services/getAssessmentsById';

import routes from '../constants/routes';

import AssessmentRow from '../components/AssessmentRow';

const fortyEightHoursAgoInMilliseconds = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);

  const fortyEightHoursInMilliseconds = 1.728e8;
  const startOfTheDayInMilliseconds = getTimeStamp(date);
  return startOfTheDayInMilliseconds - fortyEightHoursInMilliseconds;
};

const isWithin48Hours = ({ createdAt }) =>
  getTimeStamp(new Date(createdAt)) >= fortyEightHoursAgoInMilliseconds();

const AssessmentTable = children =>
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
      {children}
    </tbody>
  </table>;

const renderAssessmentList = map(AssessmentRow);
const renderLast48Hours = compose(renderAssessmentList, filter(isWithin48Hours));

class Dashboard extends Component {
  constructor() {
    super();

    this.state = {
      filterLast48Hours: false,
    };
  }
  componentDidMount() {
    this.props.getOffenderAssessments();
  }

  toggleFilter() {
    this.setState({ filterLast48Hours: !this.state.filterLast48Hours });
  }

  renderAssessments() {
    const {
      assessments,
      onViewOutcomeClick,
      onOffenderHealthcareSelect,
      onOffenderSelect,
    } = this.props;

    const addClickFuncsToAssessment = item => ({
      ...item,
      onViewOutcomeClick,
      onOffenderHealthcareSelect,
      onOffenderSelect,
    });

    const profiles = map(addClickFuncsToAssessment, assessments);

    if (this.state.filterLast48Hours) {
      const assessmentsInTheLast48Hours = renderLast48Hours(assessments);

      if (isEmpty(assessmentsInTheLast48Hours)) {
        return (
          <div className="u-text-align-center">
            <h1 className="heading-large">
              <span>No assessments found in the last 48 hours</span>
            </h1>
          </div>
        );
      }

      return AssessmentTable(assessmentsInTheLast48Hours);
    }

    return AssessmentTable(renderAssessmentList(profiles));
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
              <Link to={routes.ADD_OFFENDER} className="button" data-element-id="continue-button">
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
                <div className="grid-row">
                  <div className="column-two-thirds">
                    <h1 data-title="dashboard" className="heading-large">
                      {this.state.filterLast48Hours
                          ? 'Assessments from last 48 hours'
                          : 'All assessments'}
                    </h1>
                  </div>
                  <div className="column-one-third">
                    <span
                      onClick={() => this.toggleFilter()}
                      className="link c-main-heading-link"
                    >
                      {this.state.filterLast48Hours
                          ? 'View all assessments'
                          : 'View Last 48 hours'}
                    </span>
                  </div>
                </div>
              </div>
              {this.renderAssessments()}
            </div>}
        </div>
      </DocumentTitle>
    );
  }
}

const mapStateToProps = state => ({
  assessments: state.offender.assessments,
  answers: state.answers,
});

const mapActionsToProps = dispatch => ({
  getOffenderAssessments: () => {
    getAssessments((assessments) => {
      if (assessments) {
        dispatch(getOffenderAssessments(assessments));
      }
    });
  },
  onOffenderSelect: (prisoner) => {
    getAssessmentsById(prisoner.id, (response) => {
      if (response && response.riskAssessment) {
        return dispatch(replace(routes.ERROR_PAGE));
      }

      dispatch(selectOffender(prisoner));
      dispatch(push(routes.PRISONER_PROFILE));

      return true;
    });
  },
  onOffenderHealthcareSelect: (prisoner) => {
    getAssessmentsById(prisoner.id, (response) => {
      if (response && response.healthAssessment) {
        return dispatch(replace(routes.ERROR_PAGE));
      }

      dispatch(selectOffender(prisoner));
      dispatch(startHealthcareAssessmentFor({ id: prisoner.id }));
      dispatch(push(`${routes.HEALTHCARE_ASSESSMENT}/outcome`));

      return true;
    });
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
};

Dashboard.defaultProps = {
  title: 'Dashboard',
  getOffenderAssessments: () => {},
  onOffenderHealthcareSelect: () => {},
  onOffenderSelect: () => {},
  onViewOutcomeClick: () => {},
  assessments: [],
};

export { Dashboard };

export default connect(mapStateToProps, mapActionsToProps)(Dashboard);
