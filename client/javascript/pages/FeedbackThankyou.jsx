import React from 'react';
import DocumentTitle from 'react-document-title';

import { Link } from 'react-router-dom';
import Routes from '../constants/routes';

export default () => (
  <DocumentTitle title="Feedback Thank you">
    <div className="grid-row">
      <div className="column-two-thirds">
        <div className="govuk-box-highlight">
          <h1 className="bold-large">Thanks for the feedback</h1>
          <p>
            We will be reviewing it shortly <br />
            And get back to you.
          </p>
        </div>

        <p className="u-margin-bottom-default">
          <Link to={Routes.DASHBOARD} className="link">
            Return the prisoner List
          </Link>
        </p>
      </div>
    </div>
  </DocumentTitle>
);
