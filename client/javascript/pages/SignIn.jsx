import React, { Component, PropTypes } from 'react';
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
      <form action="/" method="POST" className="form" onSubmit={event => this.handleSubmit(event)}>
        <h1 className="form-title heading-large">Your full name</h1>

        <div className="form-group">
          <input type="text" className="form-control" id="username" name="username" data-username />
        </div>

        <div className="form-group">
          <input type="submit" className="button" value="Sign in" data-sign-in-button />
        </div>
      </form>
    );
  }
}

SignIn.propTypes = {
  onSubmit: PropTypes.func,
};

const mapActionsToProps = dispatch => ({
  onSubmit: (name) => {
    dispatch(replace(routes.BEFORE_YOU_START));
    dispatch(signIn(name));
  },
});

export { SignIn };

export default connect(null, mapActionsToProps)(SignIn);
