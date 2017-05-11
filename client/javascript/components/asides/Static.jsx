import React, { PropTypes } from 'react';

const Static = ({ title, description }) => (
  <aside className="govuk-related-items" role="complementary">
    <h3 className="heading-medium u-margin-top-default" id="subsection-title">{title}</h3>
    <div dangerouslySetInnerHTML={{ __html: description }} />
  </aside>
);

Static.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
};

export default Static;
