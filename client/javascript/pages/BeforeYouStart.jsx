import React from 'react';
import DocumentTitle from 'react-document-title';
import { Link } from 'react-router';
import routes from '../constants/routes';

const BeforeYouStart = props => (
  <DocumentTitle title={props.title}>
    <div>
      <h1 className="heading-large">Cell sharing risk assessment</h1>
      <p className="text">
        This service helps you decide whether a prisoner can safely share a cell.
      </p>
      <Link
        to={routes.DASHBOARD}
        className="button button-start"
        data-before-you-start-button
      >
        Continue
      </Link>
    </div>
  </DocumentTitle>
);

BeforeYouStart.defaultProps = {
  title: 'Before you start',
};

export default BeforeYouStart;
