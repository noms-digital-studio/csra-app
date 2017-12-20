import React, { PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import path from 'ramda/src/path';

import { startRiskAssessmentFor } from '../actions';
import { retrieveViperScoreFor } from '../services';
import { capitalize, extractDateFromUTCString } from '../utils';


import routes from '../constants/routes';

const OffenderProfile = ({ details, title, onSubmit, isAlreadyComplete }) => (
  <DocumentTitle title={title}>
    <div>
      <p>
        <Link to={{ pathname: routes.DASHBOARD }} className="link-back">
          Back to dashboard
        </Link>
      </p>
      <h1 data-title="prisoner-confirmation" className="heading-xlarge">
        <span className="heading-secondary">Confirm identity.</span>
        Details
      </h1>

      <div className="c-offender-details-container u-clear-fix">
        <div className="grid-row">
          <div className="column-one-half">
            <div className="c-offender-profile-image">
              {(details.image)
                ? <img src={details.image} alt={details.forename} />
                : <img src="/assets/images/profile-placeholder.gif" />
              }
            </div>
            <div data-offender-profile-details className="c-offender-profile-details">
              <div>
                <p className="c-offender-profile-item">
                  <span className="heading-small">Name:&nbsp;</span>
                  <span data-element-id="prisoner-name">
                    {capitalize(details.forename)} {capitalize(details.surname)}
                  </span>
                </p>
              </div>
              <div>
                <p className="c-offender-profile-item">
                  <span className="heading-small">DOB:&nbsp;&nbsp;&nbsp;&nbsp;</span>
                  {extractDateFromUTCString(details.dateOfBirth)}
                </p>
              </div>
              <div>
                <p className="c-offender-profile-item">
                  <span className="heading-small">NOMIS ID:&nbsp;</span>
                  {details.nomisId}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p>
        <button
          type="button"
          onClick={() => onSubmit(details, isAlreadyComplete)}
          className="button button-start u-margin-bottom-default"
          data-element-id="continue-button"
        >
          Continue to assessment
        </button>
      </p>
    </div>
  </DocumentTitle>
);

OffenderProfile.propTypes = {
  title: PropTypes.string,
  details: PropTypes.shape({
    forename: PropTypes.string,
    dateOfBirth: PropTypes.string,
    nomisId: PropTypes.string,
    surname: PropTypes.string,
  }),
  isAlreadyComplete: PropTypes.bool,
  onSubmit: PropTypes.func,
};

OffenderProfile.defaultProps = {
  title: 'Confirm Prisoner',
  onSubmit: () => {},
  details: {},
};

const mapStateToProps = state => ({
  details: state.offender.selected,
  isAlreadyComplete: Boolean(
    state.assessmentStatus.awaitingSubmission.risk.find(
      item => item.assessmentId === state.offender.selected.id,
    ),
  ),
});

const mapActionsToProps = dispatch => ({
  onSubmit: (prisoner, isAlreadyComplete) => {
    retrieveViperScoreFor(prisoner.nomisId, (response) => {
      const viperScore = path(['viperRating'], response);


      dispatch(
        startRiskAssessmentFor({
          viperScore: viperScore >= 0 ? viperScore : null,
          id: prisoner.id,
        }),
      );

      if (isAlreadyComplete) {
        return dispatch(push(routes.RISK_ASSESSMENT_SUMMARY));
      }

      return dispatch(push(`${routes.RISK_ASSESSMENT}/introduction`));
    });
  },
});

export default connect(mapStateToProps, mapActionsToProps)(OffenderProfile);
