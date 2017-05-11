import React from 'react';
import { Link } from 'react-router';
import routes from '../constants/routes';

const BeforeYouStart = () => (
  <div>
    <h1 className="heading-large">Before you start</h1>
    <p className="text">
      This service will help you decide whether a prisoner can safely share a cell, or should be allocated a single cell.
    </p>
    <p className="text">
      It uses the Violence in Prison Estimator (Viper) to measure a prisoner’s risk of violence in the next 6 months. This decision is based on data recorded on NOMIS, including any previous incidents, sentence information and case notes.
    </p>
    <h2 className="heading-medium">Prisoners at high risk</h2>
    <p className="text">
      If Viper estimates the prisoner’s risk of violence is high, the service will automatically recommend the prisoner is allocated a single cell.
    </p>
    <h2 className="heading-medium">Prisoners at low risk</h2>
    <p className="text u-margin-bottom-large">
      If the prisoner’s risk of violence is low, you must ask them to answer a short set of questions which will result in a cell sharing recommendation.
    </p>

    <Link to={routes.DASHBOARD} className="button button-start">Continue to dashboard</Link>
  </div>
);

export default BeforeYouStart;
