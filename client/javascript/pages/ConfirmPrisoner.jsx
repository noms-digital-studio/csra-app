import React, { PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import { replace } from 'react-router-redux';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import not from 'ramda/src/not';
import routes from '../constants/routes';
import { retrieveViperScoreFor } from '../services';
import { confirmPrisoner, addViperScore } from '../actions';

const ConfirmOffender = ({ prisonerDetails: prisoner, onClick, title }) => (
  <DocumentTitle title={title}>
    <div>
      <h1 className="heading-xlarge">Prisoner Added</h1>

      <div className="grid-row">
        <div className="column-one-half">
          <p>
            <span className="heading-small">Name:&nbsp;</span>
            <span data-prisoner-name>
              {prisoner['first-name']} {prisoner['last-name']}
            </span>
          </p>

          <p>
            <span className="heading-small">
              DOB:&nbsp;&nbsp;&nbsp;&nbsp;
              </span>
            <span
              data-prisoner-dob
            >{`${prisoner['dob-day']}-${prisoner['dob-month']}-${prisoner['dob-year']}`}</span>
          </p>
        </div>
        <div className="column-one-half">
          <p>
            <span className="heading-small">NOMIS No:</span>
            <span data-prisoner-nomis-id>{prisoner['nomis-id']}</span>
          </p>
        </div>
      </div>

      <p>
        <button
          type="button"
          data-confirm
          onClick={() => {
            onClick(prisoner);
          }}
          className="button"
          data-continue-button
        >
          Confirm
          </button>
      </p>
      <Link to={routes.ADD_OFFENDER}>Edit</Link>
    </div>
  </DocumentTitle>
);

const mapStateToProps = state => ({
  prisonerDetails: state.offender.prisonerFormData,
});

const mapActionsToProps = dispatch => ({
  onClick: (prisoner) => {
    retrieveViperScoreFor(prisoner['nomis-id'], (error, response) => {
      if (not(error)) {
        dispatch(addViperScore({ viperScore: response.viperRating, nomisId: response.nomisId }));
      }

      dispatch(confirmPrisoner(prisoner));
      dispatch(replace(routes.DASHBOARD));
    });
  },
});

ConfirmOffender.propTypes = {
  title: PropTypes.string,
  prisonerDetails: PropTypes.shape({
    nomisId: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    dob: PropTypes.string,
  }),
  onClick: PropTypes.func,
};

ConfirmOffender.defaultProps = {
  title: 'Confirm Prisoner Addition',
  prisonerDetails: {},
  onClick: () => { },
};

export default connect(mapStateToProps, mapActionsToProps)(ConfirmOffender);
