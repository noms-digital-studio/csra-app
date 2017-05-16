import React from 'react';
import { Link } from 'react-router';
import routes from '../constants/routes';

const BeforeYouStart = () => (
  <div>
    <h1 className="heading-large">Cell sharing risk assessment</h1>
    <p className="text">
      This service helps you decide whether a prisoner can safely share a cell.
    </p>
   


    <Link to={routes.DASHBOARD} className="button button-start">Continue and sign in</Link>
  </div>
);

export default BeforeYouStart;
