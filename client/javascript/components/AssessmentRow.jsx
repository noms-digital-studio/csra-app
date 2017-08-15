import React, { PropTypes } from 'react';

import { capitalize, extractDateFromUTCString } from '../utils';

const AssessmentRow = props =>
  <tr
    data-element-id={`profile-row-${props.nomisId}`}
    key={props.id}
    data-assessment-id={props.id}
    data-assessments-complete={props.healthAssessmentCompleted && props.riskAssessmentCompleted}
  >
    <td>
      <span className="c-profile-holder" />
    </td>
    <td>
      {props.forename} {props.surname}
    </td>
    <td>
      {props.nomisId}
    </td>
    <td>
      {extractDateFromUTCString(props.dateOfBirth)}
    </td>
    <td data-risk-assessment-complete={props.riskAssessmentCompleted}>
      {props.riskAssessmentCompleted
        ? <span>Complete</span>
        : <button
          type="button"
          onClick={() => props.onOffenderSelect(props)}
          className="link u-link"
          data-element-id={`start-csra-link-${props.nomisId}`}
        >
            Start
          </button>}
    </td>
    <td data-health-assessment-complete={props.healthAssessmentCompleted}>
      {props.healthAssessmentCompleted
        ? <span>Complete</span>
        : <button
          type="button"
          onClick={() => props.onOffenderHealthcareSelect(props)}
          className="link u-link"
          data-element-id={`start-healthcare-link-${props.nomisId}`}
        >
            Start
          </button>}
    </td>
    <td className="u-text-align-center">
      {props.outcome
        ? <span>
          {capitalize(props.outcome)}
        </span>
        : <span className="c-status-indicator" />}
    </td>
    <td data-element-id="view-outcome" className="u-text-align-center">
      {props.outcome
        ? <span>
          <button
            className="link u-link"
            onClick={() => props.onViewOutcomeClick(props)}
            data-element-id={`view-outcome-link-${props.nomisId}`}
          >
              View
            </button>
        </span>
        : <span />}
    </td>
  </tr>;

AssessmentRow.propTypes = {
  id: PropTypes.number,
  nomisId: PropTypes.string,
  forename: PropTypes.string,
  surname: PropTypes.string,
  dateOfBirth: PropTypes.string,
  outcome: PropTypes.string,
  healthAssessmentCompleted: PropTypes.bool,
  riskAssessmentCompleted: PropTypes.bool,
  onOffenderSelect: PropTypes.func,
  onOffenderHealthcareSelect: PropTypes.func,
  onViewOutcomeClick: PropTypes.func,
};

export default AssessmentRow;
