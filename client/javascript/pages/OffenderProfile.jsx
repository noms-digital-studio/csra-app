import React, { PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import routes from '../constants/routes';
import { retrieveViperScoreFor } from '../services';
import { addViperScore } from '../actions';

const OffenderProfile = ({
  details: { firstName, dob, nomisId, surname },
  title,
  onSubmit,
  viperScores,
}) => (
  <DocumentTitle title={title}>
    <div>
      <p>
        <Link to={{ pathname: routes.DASHBOARD }} className="link-back">
          Back to dashboard
        </Link>
      </p>
      <h1 className="heading-xlarge">
        <span className="heading-secondary">
          Confirm identity.
        </span>
        Details
      </h1>

      <div className="c-offender-details-container u-clear-fix">
        <div className="grid-row">
          <div className="column-one-half">
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
                  <span data-prisoner-name>{firstName} {surname}</span>
                </p>
              </div>
              <div>
                <p className="c-offender-profile-item">
                  <span className="heading-small">
                    DOB:&nbsp;&nbsp;&nbsp;&nbsp;
                  </span>
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

      <p>
        <button
          onClick={() => onSubmit(nomisId, viperScores)}
          className="button button-start u-margin-bottom-default"
          data-continue-button
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
    firstName: PropTypes.string,
    dob: PropTypes.string,
    nomisId: PropTypes.string,
    surname: PropTypes.string,
  }),
  viperScores: PropTypes.arrayOf(
    PropTypes.shape({
      nomisId: PropTypes.string,
      viperScore: PropTypes.number,
    }),
  ),
  onSubmit: PropTypes.func,
};

OffenderProfile.defaultProps = {
  title: 'Confirm Prisoner',
  onSubmit: () => {},
  viperScores: [],
};

const mapStateToProps = state => ({
  details: state.offender.selected,
  viperScores: state.offender.viperScores,
});

const mapActionsToProps = dispatch => ({
  onSubmit: (nomisId, viperScores) => {
    const viperScoreExist = viperScores.findIndex(
      item => item.nomisId === nomisId,
    );
    if (viperScoreExist === -1) {
      retrieveViperScoreFor(nomisId, (error, response) => {
        if (error) {
          dispatch(push(`${routes.RISK_ASSESSMENT}/introduction`));
        } else {
          dispatch(addViperScore(response));
          dispatch(push(`${routes.RISK_ASSESSMENT}/introduction`));
        }
      });
    } else {
      dispatch(push(`${routes.RISK_ASSESSMENT}/introduction`));
    }
  },
});

export default connect(mapStateToProps, mapActionsToProps)(OffenderProfile);
