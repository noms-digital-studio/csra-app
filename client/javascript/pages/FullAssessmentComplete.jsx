import React from 'react';
import { Link } from 'react-router';

import routes from '../constants/routes';

const FullAssessmentComplete = () => (
  <div>
    <h1 className="heading-xlarge">Cell sharing risk assessment complete</h1>

    <Link className="button" to={routes.DASHBOARD} data-continue-button>Return to the prisoner list</Link>
  </div>
);


export default FullAssessmentComplete;
