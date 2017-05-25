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
      <p className="text" />
      <p> The recommendation is based on:</p>
      <ul className="list list-bullet">
        <li> data recorded on NOMIS</li>
        <li> any previous incidents</li>
        <li> sentence information</li>
        <li> case notes</li>
      </ul>

      <Link
        to={routes.DASHBOARD}
        className="button button-start"
        data-before-you-start-button
      >
        Continue and sign in
      </Link>
    </div>
  </DocumentTitle>
);

BeforeYouStart.defaultProps = {
  title: 'Before you start',
};

export default BeforeYouStart;
