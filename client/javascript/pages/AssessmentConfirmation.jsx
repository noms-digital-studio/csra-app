import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';

import routes from '../constants/routes';

import SelectableInput from '../components/SelectableInput';

const AssessmentConfirmation = (props) => {
  const {
    prisoner: { firstName, dob, nomisId, surname },
    outcome,
    onSubmit,
  } = props;

  return (
    <div>
      <div className="grid-row">
        <div className="column-two-thirds">
          <div className="govuk-box-highlight">
            <h1 className="bold-large">Assessment confirmation</h1>
            <p>
              Prisoner risk assessment has been completed and <br />
              the outcome has been successfully submitted.
            </p>
          </div>

          <p className="u-margin-bottom-default">
            Please ensure you have printed a copy of this page for your records.
          </p>
        </div>
      </div>
      <h2 className="heading-medium u-margin-top-default">Assessment Summary</h2>

      <div className="grid-row">
        <div className="column-two-thirds">
          <div className="c-offender-details-container u-no-margin-top u-margin-bottom-small">

            <div className="grid-row">
              <div className="column-one-half">
                <div data-offender-profile-prisoner className="c-offender-profile-prisoner">
                  <div>
                    <p className="c-offender-profile-item">
                      <span className="heading-small">Name:&nbsp;</span>
                      <span data-prisoner-name>{firstName} {surname}</span>
                    </p>
                  </div>
                  <div>
                    <p className="c-offender-profile-item">
                      <span className="heading-small">DOB:&nbsp;&nbsp;&nbsp;&nbsp;</span>
                      <span data-prisoner-dob>{dob}</span>
                    </p>
                  </div>
                  <div>
                    <p className="c-offender-profile-item">
                      <span className="heading-small">NOMIS ID:&nbsp;</span>
                      <span data-prisoner-nomis-id>{nomisId}</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="column-one-half">
                <div className="c-offender-profile-prisoner">
                  <p><span className="heading-small">Outcome: <span data-outcome>{outcome.recommendation}</span></span></p>
                </div>
              </div>
            </div>

            <div className="grid-row">
              <div className="column-full">
                <p className="bold-small">Recommended action:</p>
                {outcome.rating === 'low' &&
                  <p>
                    Based on what we know about your offence and your previous time in prison, we think you can act calmly and appropriately around other prisoners.
                  </p>}
                <ul className="list list-bullet">
                  {outcome.reasons.map((reason, key) => <li key={key}>{reason}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid-row">
        <div className="column-two-thirds">
          <form
            className="c-confirmation-form"
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit(routes.DASHBOARD);
            }}
          >
            <p className="c-form-label-container u-clear-fix bold u-margin-bottom-medium">
              <SelectableInput
                required
                type="checkbox"
                id="confirmation"
                value="accepted"
                text="I have explained the reason for the decision to the prisoner."
                name="confirmation"
              />
            </p>

            <p>
              <input className="button button-start" type="submit" value="Complete" data-continue-button />
            </p>
          </form>
        </div>
      </div>

      <div className="grid-row">
        <div className="column-two-thirds">
          <div className="c-print-link">
            <button className="c-icon-button link" onClick={() => window.print()}>
              Print Page
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

const mapStateToProps = ({ offender, assessmentStatus }) => ({
  prisoner: offender.selected,
  outcome: assessmentStatus.completed.find(
    assessment => assessment.nomisId === offender.selected.nomisId,
  ),
});

AssessmentConfirmation.propTypes = {
  prisoner: PropTypes.shape({
    firstName: PropTypes.string,
    dob: PropTypes.string,
    nomisId: PropTypes.string,
    surname: PropTypes.string,
  }),
  outcome: PropTypes.shape({
    rating: PropTypes.string,
    recommendation: PropTypes.string,
    reasons: PropTypes.arrayOf(PropTypes.string),
  }),
  onSubmit: PropTypes.func,
};

AssessmentConfirmation.defaultProps = {
  prisoner: {},
  outcome: {
    reasons: [],
  },
  onSubmit: () => {},
};

export { AssessmentConfirmation };

export default connect(mapStateToProps, { onSubmit: replace })(AssessmentConfirmation);
