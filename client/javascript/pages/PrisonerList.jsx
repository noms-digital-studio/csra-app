import React, { Component, PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import { push, replace } from 'react-router-redux';
import { Link } from 'react-router';
import isEmpty from 'ramda/src/isEmpty';
import compose from 'ramda/src/compose';
import map from 'ramda/src/map';
import filter from 'ramda/src/filter';
import not from 'ramda/src/not';
import path from 'ramda/src/path';
import pluralize from 'pluralize';


import { getTimeStamp } from '../utils';
import {
  selectOffender,
  getOffenderAssessments,
  startHealthcareAssessmentFor,
} from '../actions';
import getAssessments from '../services/getAssessments';
import getAssessmentsById from '../services/getAssessmentsById';

import routes from '../constants/routes';

import AssessmentRow from '../components/AssessmentRow';
import SelectableInput from '../components/SelectableInput';


const fortyEightHoursAgoInMilliseconds = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);

  const fortyEightHoursInMilliseconds = 1.728e8;
  const startOfTheDayInMilliseconds = getTimeStamp(date);
  return startOfTheDayInMilliseconds - fortyEightHoursInMilliseconds;
};

const isWithin48Hours = ({ createdAt }) =>
  getTimeStamp(new Date(createdAt)) >= fortyEightHoursAgoInMilliseconds();

const AssessmentTable = children => (
  <table className="c-table-vam">
    <thead>
      <tr>
        <th scope="col">
          <span>Prisoner</span>
          <span className="c-triangle c-triangle--down" />
        </th>
        <th scope="col">
          <span>Arrived</span>
          <span className="c-triangle c-triangle--down" />
        </th>
        <th scope="col">Risk</th>
        <th scope="col">Healthcare</th>
        <th scope="col">CSRA outcome</th>
        <th scope="col">&nbsp;</th>
      </tr>
    </thead>
    <tbody>{children}</tbody>
  </table>
);

const renderAssessmentList = map(AssessmentRow);
const renderLast48Hours = compose(renderAssessmentList, filter(isWithin48Hours));

class PrisonerList extends Component {
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
      assessments: rawAssessments,
      isAwaitingSubmission,
      onViewOutcomeClick,
      onOffenderHealthcareSelect,
      onOffenderSelect,
      onRiskAssessmentSelect,
      onHealthcareSelect,
      location,
    } = this.props;

    const displayTestAssessments = path(['query', 'displayTestAssessments'], location);
    const addClickFunctionsToAssessment = map(item => ({
      ...item,
      isAwaitingSubmission,
      onViewOutcomeClick,
      onOffenderHealthcareSelect,
      onOffenderSelect,
      onRiskAssessmentSelect,
      onHealthcareSelect,
    }));
    const excludeTestAssessments = filter(
      assessment => not(assessment.nomisId.startsWith('TEST')) || displayTestAssessments === 'true',
    );
    const generateAssessments = compose(addClickFunctionsToAssessment, excludeTestAssessments);
    const assessments = generateAssessments(rawAssessments);

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

    return AssessmentTable(renderAssessmentList(assessments));
  }

  render() {
    const { assessments } = this.props;
    return (
      <DocumentTitle title={this.props.title}>
        <div>
          <Link className="link-back" to={routes.DASHBOARD}>
            Back to dashboard
          </Link>
          <h1 className="c-page-title">Prisoner List</h1>

          {isEmpty(assessments) ? (
            <div>
              <h2 className="heading-large">
                <span>There is no one to assess.</span>
              </h2>
              <Link to={routes.ADD_OFFENDER} className="button" data-element-id="add-assessment">
                Add someone to assess
              </Link>
            </div>
          ) : (
            <div>
              <div className="c-cards c-cards--blue">
                <form>
                  <div className="grid-row u-margin-bottom-charlie">
                    <div className="column-one-third">
                      <label className="form-label form-label--small c-card__label" htmlFor="name-number">Filter by prisoner name or number</label>
                      <input className="form-control c-card__input" id="name-number" type="text" name="name-number" />
                    </div>
                    <div className="column-one-third">
                      <label className="form-label c-card__label" htmlFor="last-name">View by date</label>
                      <input className="form-control c-card__input" id="date" type="date" name="date" />
                    </div>
                    <div className="column-one-third">
                      <button className="link u-link u-float-right" type="reset">Clear filters</button>
                    </div>
                  </div>
                  <label htmlFor="" className="form-label--small u-d-block u-margin-bottom-delta">Show only:</label>
                  <div className="grid-row">
                    <div className="column-one-quarter">
                      <SelectableInput
                        type="radio"
                        id="incomplete_csras"
                        value="1"
                        text="Incomplete CSRAs"
                        name="csra_filter"
                      />
                    </div>
                    <div className="column-one-quarter">
                      <SelectableInput
                        type="radio"
                        id="complete_csras"
                        value="1"
                        text="Completed CSRAs"
                        name="csra_filter"
                      />
                    </div>
                    <div className="column-one-quarter">
                      <SelectableInput
                        type="radio"
                        id="high_risk"
                        value="1"
                        text="High risk prisoners"
                        name="csra_filter"
                      />
                    </div>
                    <div className="column-one-quarter">
                      <SelectableInput
                        type="radio"
                        id="single_cell"
                        value="1"
                        text="Single cells"
                        name="csra_filter"
                      />
                    </div>
                  </div>
                </form>
              </div>
              <p>{assessments.length} {pluralize('prisoner', assessments.length)}</p>
              {this.renderAssessments()}
            </div>
          )}
        </div>
      </DocumentTitle>
    );
  }
}

const mapStateToProps = state => ({
  assessments: state.offender.assessments,
  answers: state.answers,
  isAwaitingSubmission: id =>
    Boolean(
      state.assessmentStatus.awaitingSubmission.healthcare.find(item => item.assessmentId === id),
    ),
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
  onRiskAssessmentSelect: (prisoner) => {
    dispatch(selectOffender(prisoner));
    dispatch(push(`${routes.RISK_ASSESSMENT_SUMMARY}`));
  },
  onHealthcareSelect: (prisoner) => {
    dispatch(selectOffender(prisoner));
    dispatch(push(`${routes.HEALTHCARE_SUMMARY}`));
  },
  onOffenderHealthcareSelect: (prisoner) => {
    getAssessmentsById(prisoner.id, (response) => {
      if (response && response.healthAssessment) {
        return dispatch(replace(routes.ERROR_PAGE));
      }

      dispatch(selectOffender(prisoner));
      dispatch(startHealthcareAssessmentFor({ id: prisoner.id }));

      if (prisoner.isAwaitingSubmission) {
        return dispatch(push(routes.HEALTHCARE_SUMMARY));
      }

      return dispatch(push(`${routes.HEALTHCARE_ASSESSMENT}/outcome`));
    });
  },
  onViewOutcomeClick: (offender) => {
    dispatch(selectOffender(offender));
    dispatch(push(`${routes.FULL_ASSESSMENT_OUTCOME}`));
  },
});

PrisonerList.propTypes = {
  title: PropTypes.string,
  isAwaitingSubmission: PropTypes.func,
  assessments: PropTypes.arrayOf(
    PropTypes.shape({
      nomisId: PropTypes.string,
      surname: PropTypes.string,
      forename: PropTypes.string,
      dateOfBirth: PropTypes.string,
      riskAssessmentOutcome: PropTypes.string,
      healthAssessmentOutcome: PropTypes.string,
      outcome: PropTypes.string,
    }),
  ),
  location: PropTypes.object,
  onRiskAssessmentSelect: PropTypes.func,
  getOffenderAssessments: PropTypes.func,
  onOffenderHealthcareSelect: PropTypes.func,
  onOffenderSelect: PropTypes.func,
  onViewOutcomeClick: PropTypes.func,
};

PrisonerList.defaultProps = {
  title: 'CSRA - Prisoner List',
  getOffenderAssessments: () => {},
  onOffenderHealthcareSelect: () => {},
  onOffenderSelect: () => {},
  onViewOutcomeClick: () => {},
  assessments: [],
  location: {},
};

export default connect(mapStateToProps, mapActionsToProps)(PrisonerList);
