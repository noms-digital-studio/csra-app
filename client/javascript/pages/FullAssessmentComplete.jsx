import React from 'react';
import { Link } from 'react-router';
import DocumentTitle from 'react-document-title';

import routes from '../constants/routes';

const FullAssessmentComplete = () => (
  <DocumentTitle title="Full Assessment Complete">
    <div>
      <h1 data-title="full-assessment-complete" className="heading-xlarge">Cell sharing risk assessment complete</h1>

      <Link className="button" to={routes.DASHBOARD} data-element-id="continue-button">
        Return to the prisoner list
      </Link>
    </div>
  </DocumentTitle>
);

export default FullAssessmentComplete;
