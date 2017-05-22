import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';

import { completeAssessmentFor } from '../actions';
import { calculateRiskFor as viperScoreFor } from '../services';

import routes from '../constants/routes';

const extractDecision = (questions, exitPoint, viperScore) => {
  if (exitPoint) {
    const question = questions.find(item => item.section === exitPoint);
    return {
      recommendation: 'Single Cell',
      rating: 'high',
      reasons: question.sharedCellPredicate.reasons,
    };
  }

  if (viperScore === 'unknown') {
    return {
      recommendation: 'Single Cell',
      rating: 'unknown',
      reasons: [
        'Based on the fact that a Viper Score was not available for you.',
      ],
    };
  }

  return {
    recommendation: 'Shared Cell',
    rating: 'low',
    reasons: [
      'Take into consideration any prejudices and hostile views. Ensure that the nature of these views is taken into account when allocating a cell mate. Inform the keyworker to monitor the impact on other prisoners.',
    ],
  };
};

const AssessmentComplete = ({
  prisoner: { firstName, dob, nomisId, surname },
  onSubmit,
  outcome,
}) => (
  <div>
    <div className="grid-row">
      <div className="column-two-thirds">
        <h1 className="heading-xlarge">Assessment Complete</h1>
        <h2 className="heading-large">Prisoner details</h2>

        <div className="c-offender-details-container u-no-margin-bottom">
          <div className="grid-row">
            <div className="column-full">
              <div className="c-offender-profile-image">
                <img src="/assets/images/profile-placeholder.gif" />
              </div>
              <div
                data-offender-profile-details
                className="c-offender-profile-details"
              >
                <div>
                  <p className="c-offender-profile-item">
                    <span className="heading-small">Name:&nbsp;</span>
                    {firstName} {surname}
                  </p>
                </div>
                <div>
                  <p className="c-offender-profile-item">
                    <span className="heading-small">DOB:&nbsp;</span>
                    {dob}
                  </p>
                </div>
                <div>
                  <p className="c-offender-profile-item">
                    <span className="heading-small">NOMIS ID:&nbsp;</span>
                    {nomisId}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <h2 className="heading-large">
      Recommended action: {outcome.recommendation}
    </h2>

    <div className="grid-row">
      <div className="column-two-thirds">
        <div className="panel panel-border-wide u-margin-bottom-large">
          {outcome.rating === 'low' &&
            <p>
              Based on what we know about your offence and your previous time in prison,
              we think you can act calmly and appropriately around other prisoners.
            </p>}
          <ul className="list list-bullet">
            {outcome.reasons.map((reason, key) => <li key={key}>{reason}</li>)}
          </ul>
        </div>
      </div>
    </div>

    <p>
      <button
        className="button button-start u-margin-bottom-default"
        onClick={() => onSubmit({ ...outcome, nomisId })}
      >
        Submit Decision
      </button>
    </p>

  </div>
);

AssessmentComplete.propTypes = {
  outcome: PropTypes.shape({
    recommendation: PropTypes.string,
    rating: PropTypes.string,
    reasons: PropTypes.arrayOf(PropTypes.string),
  }),
  onSubmit: PropTypes.func,
  prisoner: PropTypes.shape({
    firstName: PropTypes.string,
    dob: PropTypes.string,
    nomisId: PropTypes.string,
    surname: PropTypes.string,
  }),
};

AssessmentComplete.defaultProps = {
  outcome: {
    reasons: [],
  },
  prisoner: {},
  onSubmit: () => {},
};

const mapStateToProps = state => ({
  prisoner: state.offender.selected,
  outcome: extractDecision(
    state.questions.csra,
    state.assessmentStatus.exitPoint,
    viperScoreFor(state.offender.selected.nomisId, state.offender.viperScores),
  ),
});

const mapActionsToProps = dispatch => ({
  onSubmit: (outcome) => {
    dispatch(completeAssessmentFor(outcome));
    dispatch(replace(routes.ASSESSMENT_CONFIRMATION));
  },
});

export { AssessmentComplete };

export default connect(mapStateToProps, mapActionsToProps)(AssessmentComplete);
