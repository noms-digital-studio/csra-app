import React, { Component, PropTypes } from 'react';
import DocumentTitle from 'react-document-title';

import { connect } from 'react-redux';
import { replace } from 'react-router-redux';
import serialize from 'form-serialize';

import { signIn } from '../actions';
import { allFormFieldsComplete } from '../utils';

import routes from '../constants/routes';

class SignIn extends Component {
  handleSubmit(event) {
    event.preventDefault();
    const formData = serialize(event.target, { hash: true });

    if (allFormFieldsComplete(formData, ['username'])) {
      this.props.onSubmit(formData.username);
    }
  }

  render() {
    return (
      <DocumentTitle title={this.props.title}>
        <form
          action="/"
          method="POST"
          className="form"
          onSubmit={event => this.handleSubmit(event)}
        >
          <h1 className="form-title heading-large">Your full name</h1>

          <div className="form-group">
            <input
              type="text"
              className="form-control"
              id="username"
              name="username"
              data-username
            />
          </div>

          <div className="form-group">
            <input
              type="submit"
              className="button"
              value="Sign in"
              data-continue-button
            />
          </div>
        </form>
      </DocumentTitle>
    );
  }
}

SignIn.propTypes = {
  title: PropTypes.string,
  onSubmit: PropTypes.func,
};

SignIn.defaultProps = {
  title: 'Sign in',
  onSubmit: () => {},
};

const mapActionsToProps = dispatch => ({
  onSubmit: (name) => {
    dispatch(replace(routes.BEFORE_YOU_START));
    dispatch(signIn(name));
  },
});

export { SignIn };

export default connect(null, mapActionsToProps)(SignIn);
