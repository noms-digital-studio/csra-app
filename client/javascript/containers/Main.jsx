import React, { PropTypes } from 'react';

const MainTemplate = ({ children }) => (
  <div className="o-csra-container js-enabled">
    {children}
  </div>
);

MainTemplate.propTypes = {
  children: PropTypes.element,
};

export default MainTemplate;
