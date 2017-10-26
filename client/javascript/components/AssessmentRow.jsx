import React, { PropTypes } from 'react';
import not from 'ramda/src/not';
import classnames from 'classnames';

import { capitalize, extractDateFromUTCString } from '../utils';

const AssessmentRow = (props) => {
  const bothAssessmentsComplete = props.healthAssessmentCompleted && props.riskAssessmentCompleted;
  const completedLinkCSS = classnames({
    'link': not(bothAssessmentsComplete),
    'u-link': not(bothAssessmentsComplete),
    'u-text': bothAssessmentsComplete,
  });

  return (
    <tr
      data-element-id={`profile-row-${props.nomisId}`}
      key={props.id}
      data-assessment-id={props.id}
      data-assessments-complete={bothAssessmentsComplete}
    >
      <td>
        <span className="c-profile-holder" />
      </td>
      <td>
        {props.forename} {props.surname}
      </td>
      <td>{props.nomisId}</td>
      <td>{extractDateFromUTCString(props.dateOfBirth)}</td>
      <td data-risk-assessment-complete={props.riskAssessmentCompleted}>
        {props.riskAssessmentCompleted ? (
          <button
            onClick={() => not(bothAssessmentsComplete) && props.onRiskAssessmentSelect(props)}
            type="button"
            data-element-id={`completed-csra-link-${props.nomisId}`}
            className={completedLinkCSS}>Complete</button>
          ) : (
            <button
              type="button"
              onClick={() => props.onOffenderSelect(props)}
              className="link u-link"
              data-element-id={`start-csra-link-${props.nomisId}`}
            >
              Start
            </button>
          )}
      </td>
      <td data-health-assessment-complete={props.healthAssessmentCompleted}>
        {props.healthAssessmentCompleted ? (
          <span>Complete</span>
          ) : (
            <button
              type="button"
              onClick={() =>
                props.onOffenderHealthcareSelect({
                  ...props,
                  isAwaitingSubmission: props.isAwaitingSubmission(props.id),
                })}
              className="link u-link"
              data-element-id={`start-healthcare-link-${props.nomisId}`}
            >
              Start
            </button>
          )}
      </td>
      <td className="u-text-align-center">
        {props.outcome ? (
          <span>{capitalize(props.outcome)}</span>
          ) : (
            <span className="c-status-indicator" />
          )}
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
            <span />
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
  isAwaitingSubmission: PropTypes.func,
  healthAssessmentCompleted: PropTypes.bool,
  riskAssessmentCompleted: PropTypes.bool,
  onOffenderSelect: PropTypes.func,
  onOffenderHealthcareSelect: PropTypes.func,
  onRiskAssessmentSelect: PropTypes.func,
  onViewOutcomeClick: PropTypes.func,
};

export default AssessmentRow;
