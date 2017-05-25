import React, { Component } from 'react';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';
import { completeHealthAssessmentFor } from '../actions';
import routes from '../constants/routes';

class HealthCareComplete extends Component {
  componentDidMount() {
    this.props.completeHealthAssessmentFor(this.props.offender);
  }

  render() {
    return (
      <DocumentTitle title={this.props.title}>
        <div>
          <h1 className="heading-xlarge">Healthcare assessment saved</h1>
          <p className="u-margin-bottom-large">
            The healthcare assessment has been saved, but the prisoner assessment must still&nbsp;
            be completed before their assessment out come can be made.
          </p>

          <button
            onClick={() => this.props.navigateTo(routes.DASHBOARD)}
            className="button u-margin-bottom-large"
            data-continue-button
          >
            Return to prisoner list
          </button>
        </div>
      </DocumentTitle>
    );
  }
}

HealthCareComplete.defaultProps = {
  title: 'Healthcare Assessment Complete',
};

const mapStateToProps = state => ({
  offender: state.healthcareStatus.selected,
});

export default connect(mapStateToProps, {
  completeHealthAssessmentFor,
  navigateTo: replace,
})(HealthCareComplete);
