import React, { PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import routes from '../constants/routes';

const OffenderProfile = ({
  details: { firstName, dob, nomisId, surname },
  title,
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
          Confirm prisoner identity and begin assessment
        </span>
        Prisoner details
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
          <div className="column-one-third">
            <div className="c-offender-profile-details">
              <p>
                <span className="heading-small">
                  Offence:&nbsp;&nbsp;&nbsp;
                </span>
                {' '}
                Unavailable
              </p>
            </div>
          </div>
        </div>
      </div>

      <p>
        <Link
          to={`${routes.ASSESSMENT}/introduction`}
          className="button button-start u-margin-bottom-default"
          data-continue-button
        >
          Continue to Assessment
        </Link>
      </p>

    </div>
  </DocumentTitle>
);

const mapStateToProps = state => ({
  details: state.offender.selected,
});

OffenderProfile.propTypes = {
  title: PropTypes.string,
  details: PropTypes.shape({
    firstName: PropTypes.string,
    dob: PropTypes.string,
    nomisId: PropTypes.string,
    surname: PropTypes.string,
  }),
};

OffenderProfile.defaultProps = {
  title: 'Confirm Prisoner',
};

export { OffenderProfile };

export default connect(mapStateToProps)(OffenderProfile);
