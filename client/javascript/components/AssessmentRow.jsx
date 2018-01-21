import React from 'react';
import PropTypes from 'prop-types';

import { capitalize, extractDateFromString } from '../utils';

const AssessmentRow = (props) => {
  const bothAssessmentsComplete = props.healthAssessmentOutcome && props.riskAssessmentOutcome;

  return (
    <tr
      data-element-id={`profile-row-${props.nomisId}`}
      key={props.id}
      data-assessment-id={props.id}
      data-assessments-complete={bothAssessmentsComplete}
    >
      <td>
        <span className="u-d-block">{capitalize(props.forename)} {capitalize(props.surname)}</span>
        <span className="u-d-block">{props.nomisId}</span>
      </td>
      <td>{extractDateFromString(props.receptionDate) || '_'}</td>
      <td data-risk-assessment>
        {props.riskAssessmentOutcome || '_' }
      </td>
      <td data-health-assessment>
        {props.healthAssessmentOutcome || '_'}
      </td>
      <td className="u-text-align-center">
        {props.outcome ? capitalize(props.outcome) : '_'}
      </td>
      <td data-element-id="view-outcome" className="u-text-align-center">
        {props.outcome ? (
          <span>
            <button
              className="link u-link"
              onClick={() => props.onViewOutcomeClick(props)}
              data-element-id={`view-outcome-link-${props.nomisId}`}
            >
                View
            </button>
          </span>
          ) : (
            <button className="button button-start c-button-start">Start</button>
          )}
      </td>
    </tr>
  );
};

AssessmentRow.propTypes = {
  id: PropTypes.number,
  nomisId: PropTypes.string,
  forename: PropTypes.string,
  surname: PropTypes.string,
  dateOfBirth: PropTypes.string,
  outcome: PropTypes.string,
  receptionDate: PropTypes.string,
  image: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  isAwaitingSubmission: PropTypes.func,
  riskAssessmentOutcome: PropTypes.string,
  healthAssessmentOutcome: PropTypes.string,
  onOffenderSelect: PropTypes.func,
  onOffenderHealthcareSelect: PropTypes.func,
  onRiskAssessmentSelect: PropTypes.func,
  onHealthcareSelect: PropTypes.func,
};

export default AssessmentRow;
