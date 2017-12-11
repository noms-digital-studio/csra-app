import React, { Component, PropTypes } from 'react';
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


const generateUTCDate = date =>
  Date.UTC(date.getFullYear(), date.getMonth() - 1, date.getDate()) / 1000;

const standardizePrisoner = prisoner => ({
  bookingId: prisoner.bookingId,
  nomisId: prisoner.offenderNo,
  surname: prisoner.lastName,
  forename: prisoner.firstName,
  dateOfBirth: generateUTCDate(new Date(prisoner.dateOfBirth)),
});

const offenderTable = ({ searchResults, addPrisoner }) => (
  <table className="c-results-table">
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
        <tr key={prisoner.offenderNo}>
          <td>
            <span className="c-profile-holder" />
          </td>
          <td>{prisoner.firstName} {prisoner.middleName} {prisoner.lastName}</td>
          <td>{prisoner.offenderNo}</td>
          <td>{prisoner.dateOfBirth}</td>
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
              <Link className="link-back" to={routes.DASHBOARD}>
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
              <button type="submit" className="button button-start" data-element-id="continue-button">
                Search
              </button>
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

      dispatch(replace(routes.DASHBOARD));

      return true;
    });
  },
});

export default connect(mapStateToProps, mapActionsToProps)(AddPrisoner);
