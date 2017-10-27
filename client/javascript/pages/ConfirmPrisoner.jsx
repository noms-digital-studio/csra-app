import React, { PropTypes } from 'react';
import not from 'ramda/src/not';
import DocumentTitle from 'react-document-title';
import { replace } from 'react-router-redux';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import toUpper from 'ramda/src/toUpper';
import trim from 'ramda/src/trim';
import compose from 'ramda/src/compose';
import routes from '../constants/routes';
import startAssessment from '../services/startAssessment';
import { confirmPrisoner } from '../actions';
import { extractDateFromString } from '../utils';

const toUpperAndTrim = compose(toUpper, trim);

const standardizePrisoner = prisonerData => ({
  nomisId: prisonerData.nomisId,
  surname: prisonerData.surname,
  forename: prisonerData.forename,
  dateOfBirth:
      Date.UTC(prisonerData['dob-year'], prisonerData['dob-month'] - 1, prisonerData['dob-day']) /
      1000,
});

const ConfirmOffender = ({ prisonerDetails: prisoner, onClick, title }) =>
  <DocumentTitle title={title}>
    <div>
      <h1 className="heading-xlarge">Prisoner Added</h1>
      <div className="grid-row">
        <div className="column-one-half">
          <p>
            <span className="heading-small">Name:&nbsp;</span>
            <span data-element-id="prisoner-name">
              {prisoner.forename} {prisoner.surname}
            </span>
          </p>

          <p>
            <span className="heading-small">DOB:&nbsp;</span>
            <span data-element-id="prisoner-dob">
              {extractDateFromString(
                `${prisoner['dob-day']}-${prisoner['dob-month']}-${prisoner['dob-year']}`,
              )}
            </span>
          </p>
        </div>
        <div className="column-one-half">
          <p>
            <span className="heading-small">NOMIS No: &nbsp;</span>
            <span data-element-id="nomisId">
              {toUpperAndTrim(prisoner.nomisId)}
            </span>
          </p>
        </div>
      </div>

      <p>
        <button
          type="button"
          onClick={() => {
            onClick(standardizePrisoner(prisoner));
          }}
          className="button"
          data-element-id="continue-button"
        >
          Confirm
        </button>
      </p>
      <Link to={routes.ADD_OFFENDER}>Edit</Link>
    </div>
  </DocumentTitle>;

const mapStateToProps = state => ({
  prisonerDetails: state.offender.prisonerFormData,
});

const mapActionsToProps = dispatch => ({
  onClick: (prisoner) => {
    startAssessment(prisoner, (response) => {
      if (not(response)) {
        return dispatch(replace(routes.ERROR_PAGE));
      }

      dispatch(replace(routes.DASHBOARD));
      dispatch(confirmPrisoner());

      return true;
    });
  },
});

ConfirmOffender.propTypes = {
  title: PropTypes.string,
  prisonerDetails: PropTypes.shape({
    nomisId: PropTypes.string,
    forename: PropTypes.string,
    lastName: PropTypes.string,
    dateOfBirth: PropTypes.string,
  }),
  onClick: PropTypes.func,
};

ConfirmOffender.defaultProps = {
  title: 'Confirm Prisoner Addition',
  prisonerDetails: {},
  onClick: () => {},
};

export default connect(mapStateToProps, mapActionsToProps)(ConfirmOffender);
