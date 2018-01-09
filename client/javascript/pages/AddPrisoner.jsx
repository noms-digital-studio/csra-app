import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import DocumentTitle from 'react-document-title';
import serialize from 'form-serialize';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { replace } from 'react-router-redux';

import isEmpty from 'ramda/src/isEmpty';
import isNil from 'ramda/src/isNil';
import not from 'ramda/src/not';

import searchPrisoner from '../services/searchPrisoner';
import startAssessment from '../services/startAssessment';
import routes from '../constants/routes';

import { storePrisonerSearchResults } from '../actions';

import { capitalize, extractDateFromUTCString } from '../utils';

const generateUTCDate = date => moment.utc(date).unix();

const standardizePrisoner = prisoner => ({
  facialImageId: prisoner.facialImageId,
  bookingId: prisoner.bookingId,
  nomisId: prisoner.offenderNo,
  surname: prisoner.lastName,
  forename: prisoner.firstName,
  dateOfBirth: generateUTCDate(prisoner.dateOfBirth),
});

const offenderTable = ({ searchResults, addPrisoner }) => (
  <table data-element-id="search-results" className="c-results-table">
    <thead>
      <tr>
        <th scope="col" />
        <th scope="col">
          Name
        </th>
        <th scope="col">
          Prisoner Number
        </th>
        <th scope="col">
          DOB
        </th>
        <th scope="col" />
      </tr>
    </thead>
    <tbody>
      {searchResults.map(prisoner => (
        <tr data-element-id={prisoner.offenderNo} key={prisoner.offenderNo}>
          <td>
            {(prisoner.image)
              ? <img height="80" width="70" className="c-profile-holder" src={prisoner.image} alt={prisoner.name} />
              : <span className="c-profile-holder" />
            }
          </td>
          <td>{capitalize(prisoner.firstName)} {capitalize(prisoner.middleName)} {capitalize(prisoner.lastName)}</td>
          <td>{prisoner.offenderNo}</td>
          <td>{extractDateFromUTCString(prisoner.dateOfBirth)}</td>
          <td className="numeric">
            <button data-element-id={prisoner.offenderNo} onClick={() => { addPrisoner(prisoner); }} className="button">Add prisoner</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

class AddPrisoner extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
    };
  }
  componentDidMount() {
    this.searchInput.focus();
  }

  handleSubmit(event) {
    event.preventDefault();

    this.setState({ loading: true });

    const query = serialize(event.target);
    searchPrisoner(query, (response) => {
      this.props.storeSearchResults(response);
      this.setState({ loading: false });
    });
  }

  render() {
    const loaderClasses = classnames({ loader: this.state.loading });
    const { searchResults, addPrisoner } = this.props;

    return (
      <DocumentTitle title={this.props.title}>
        <div>
          <div className="form-section">
            <p>
              <Link className="link-back" to={routes.PRISONER_LIST}>
                Back to dashboard
              </Link>
            </p>
            <header>
              <h1 className="heading-xlarge">Search for a prisoner</h1>
            </header>
            <form action="/" method="POST" onSubmit={e => this.handleSubmit(e)}>
              <div className="form-group">
                <label className="form-label" htmlFor="query">
                  Enter a prisoner name or number
                </label>
                <input
                  ref={(el) => {
                    this.searchInput = el;
                  }}
                  className="form-control"
                  name="query"
                  type="text"
                  id="query"
                  placeholder="Last Name, First Name or ID"
                  data-element-id="query"
                />
              </div>
              <button type="submit" className="button button-start" data-element-id="continue-button">Search</button>
            </form>
          </div>
          {(not(isEmpty(searchResults)) && not(isNil(searchResults))) && offenderTable({ searchResults, addPrisoner })}
          <div className={loaderClasses} />
        </div>
      </DocumentTitle>
    );
  }
}

AddPrisoner.propTypes = {
  title: PropTypes.string,
  storeSearchResults: PropTypes.func,
  searchResults: PropTypes.array,
  addPrisoner: PropTypes.func,
};

AddPrisoner.defaultProps = {
  prisonerDetails: {},
  title: 'Search for a prisoner',
};

const mapStateToProps = state => ({
  searchResults: state.offender.searchResults,
});

const mapActionsToProps = dispatch => ({
  storeSearchResults: (results) => {
    dispatch(storePrisonerSearchResults(results));
  },
  addPrisoner: (prisoner) => {
    startAssessment(standardizePrisoner(prisoner), (response) => {
      if (not(response)) {
        return dispatch(replace(routes.ERROR_PAGE));
      }

      dispatch(replace(routes.PRISONER_LIST));

      return true;
    });
  },
});

export default connect(mapStateToProps, mapActionsToProps)(AddPrisoner);
