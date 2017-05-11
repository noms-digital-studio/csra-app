import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { calculateRiskFor } from '../../services';

const riskTextFor = (rating) => {
  const riskText = {
    low: 'Low risk',
    high: 'High risk',
  };

  return riskText[rating] || 'We can\'t find this prisoner';
};

const ViolenceRisk = ({ rating }) => {
  const riskScoreClasses = classnames({
    'heading-small': true,
    [`c-risk-threat--${rating}`]: true,
  });

  return (
    <aside className="govuk-related-items" role="complementary">
      <h3 className="heading-medium u-margin-top-default" id="subsection-title">
        Risk of Violence in prison
      </h3>
      <p>
        <span data-viper-rating={rating} className={riskScoreClasses}>{riskTextFor(rating)}</span>
      </p>
    </aside>
  );
};

ViolenceRisk.propTypes = {
  rating: PropTypes.string,
};

const mapStateToProps = state => ({
  rating: calculateRiskFor(state.offender.selected.NOMS_Number, state.offender.viperScores),
});

export { ViolenceRisk };

export default connect(mapStateToProps, null)(ViolenceRisk);
