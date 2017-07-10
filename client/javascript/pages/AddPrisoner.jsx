import React, { Component, PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import serialize from 'form-serialize';

import { Link } from 'react-router';

import { allFormFieldsComplete } from '../utils';

import { addPrisoner } from '../actions';

import routes from '../constants/routes';

class AddPrisoner extends Component {
  handleSubmit(event) {
    event.preventDefault();

    const formData = serialize(event.target, { hash: true });
    const FormInputNames = Array.from(event.target.elements)
      .filter(element => element.name !== '')
      .map(element => element.name);

    if (allFormFieldsComplete(formData, FormInputNames)) {
      this.props.onSubmit(formData);
    }
  }

  render() {
    const { prisonerDetails, title } = this.props;

    return (
      <DocumentTitle title={title}>
        <div className="form-section">
          <p><Link className="link-back" to={routes.DASHBOARD}>Back to dashboard</Link></p>
          <header>
            <h1 className="heading-xlarge">
              Add Prisoner
            </h1>
          </header>
          <form action="/" method="POST" onSubmit={e => this.handleSubmit(e)}>
            <div className="form-group">
              <label className="form-label-bold" htmlFor="first-name">First name</label>
              <input className="form-control" name="first-name" type="text" id="first-name" defaultValue={prisonerDetails['first-name']} data-first-name />
            </div>
            <div className="form-group">
              <label className="form-label-bold" htmlFor="last-name">Last name</label>
              <input className="form-control" name="last-name" type="text" id="last-name" defaultValue={prisonerDetails['last-name']} data-last-name />
            </div>
            <div className="form-group">
              <fieldset>
                <legend>
                  <span className="form-label-bold">Date of birth</span>
                  <span className="form-hint" id="dob-hint">For example, 31 3 1980</span>
                </legend>
                <div className="form-date">
                  <div className="form-group form-group-day">
                    <label className="form-label" htmlFor="dob-day">Day</label>
                    <input
                      className="form-control"
                      id="dob-day"
                      name="dob-day"
                      type="number"
                      pattern="[0-9]*"
                      min="0"
                      max="31"
                      aria-describedby="dob-hint"
                      defaultValue={prisonerDetails['dob-day']}
                      data-dob-day
                    />
                  </div>
                  <div className="form-group form-group-month">
                    <label className="form-label" htmlFor="dob-month">Month</label>
                    <input
                      className="form-control"
                      id="dob-month"
                      name="dob-month"
                      type="number"
                      pattern="[0-9]*"
                      min="0"
                      max="12"
                      defaultValue={prisonerDetails['dob-month']}
                      data-dob-month
                    />
                  </div>
                  <div className="form-group form-group-year">
                    <label className="form-label" htmlFor="dob-year">Year</label>
                    <input
                      className="form-control"
                      id="dob-year"
                      name="dob-year"
                      type="number"
                      pattern="[0-9]*"
                      min="0"
                      max="2016"
                      defaultValue={prisonerDetails['dob-year']}
                      data-dob-year
                    />
                  </div>
                </div>
              </fieldset>
            </div>
            <div className="form-group">
              <label className="form-label-bold" htmlFor="nomis-id">Nomis ID</label>
              <span className="form-hint" id="nomis-id-hint">For example, A5558ZO</span>
              <input className="form-control" name="nomis-id" type="text" id="nomis-id" defaultValue={prisonerDetails['nomis-id']} data-nomis-id/>
            </div>
            <input type="submit" className="button" value="Add prisoner" data-add-prisoner-button />
          </form>
        </div>
      </DocumentTitle>
    );
  }
}

AddPrisoner.propTypes = {
  title: PropTypes.string,
  onSubmit: PropTypes.func,
  prisonerDetails: PropTypes.object,
};

AddPrisoner.defaultProps = {
  prisonerDetails: {},
  title: 'Add Prisoner',
};

const mapStateToProps = state => ({
  prisonerDetails: state.offender.prisonerFormData,
});

const mapActionsToProps = dispatch => ({
  onSubmit: (prisoner) => {
    dispatch(addPrisoner(prisoner));
    dispatch(push(routes.CONFIRM_OFFENDER));
  },
});

export { AddPrisoner };
export default connect(mapStateToProps, mapActionsToProps)(AddPrisoner);
