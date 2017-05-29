import React, { Component } from 'react';
import { Link } from 'react-router';
import routes from '../constants/routes';

class FullAssessmentComplete extends Component {
  componentDidMount() {}
  render() {
    return (
      <div>
        <h1 className="heading-xlarge">Full Prisoner assessment completed</h1>
        <Link className="button" to={routes.DASHBOARD}>Return to prisoner list</Link>
      </div>
    );
  }
}

export default FullAssessmentComplete;
