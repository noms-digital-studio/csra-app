import React, { Component, PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { getUserDetailsFromDocument } from '../utils';
import routes from '../constants/routes';

class Dashboard extends Component {
  componentDidMount() {

  }

  render() {
    const { loggedInUser, title } = this.props;

    return (
      <DocumentTitle title={title}>
        <div>
          <h1 className="c-page-title">Hello, {loggedInUser.name}</h1>
          <div className="c-cards">
            <h2 className="c-cards__title">Summary of your assessments</h2>
            <div className="grid-row u-margin-bottom-charlie">
              <div className="column-one-quarter">
                <div className="c-card">
                  <span className="c-card__number">0</span>
                  <span className="c-card__text">incomplete CSRAs</span>
                </div>
              </div>

              <div className="column-one-quarter">
                <span className="c-card__number">0</span>
                <span className="c-card__text">high risk prisoners</span>
              </div>

              <div className="column-one-quarter">
                <span className="c-card__number">0</span>
                <span className="c-card__text">completed CSRAs</span>
              </div>

              <div className="column-one-quarter">
                <span className="c-card__number">0</span>
                <span className="c-card__text">single cells</span>
              </div>
            </div>
            <Link to={routes.PRISONER_LIST} className="button button-start c-card__button">View Prisoners List</Link>
          </div>

          <div className="c-cards c-cards--blue">
            <h2 className="c-cards__title">Search for a prisoner</h2>
            <div className="grid-row u-margin-bottom-charlie">
              <div className="column-one-third">
                <label className="form-label c-card__label" htmlFor="first-name">First name</label>
                <input className="form-control c-card__input" id="first-name" type="text" name="first-name" />
              </div>
              <div className="column-one-third">
                <label className="form-label c-card__label" htmlFor="last-name">Last name</label>
                <input className="form-control c-card__input" id="last-name" type="text" name="last-name" />
              </div>
              <div className="column-one-third">
                <label className="form-label c-card__label" htmlFor="prisoner-number">Prisoner Number</label>
                <input className="form-control c-card__input" id="prisoner-number" type="text" name="prisoner-number" />
              </div>
            </div>
            {/* <button className="button button-start c-card__button">Search</button> */}
            <Link
              to={routes.ADD_OFFENDER}
              className="button button-start c-card__button"
              data-element-id="add-assessment"
            >
              Search
            </Link>

          </div>
        </div>
      </DocumentTitle>
    );
  }
}

const mapStateToProps = (props) => ({
  loggedInUser: getUserDetailsFromDocument(),
});

const mapActionsToProps = (props) => ({

});

Dashboard.defaultProps = {
  title: 'CSRA | Dashboard',
};

export default connect(mapStateToProps, mapActionsToProps)(Dashboard);
