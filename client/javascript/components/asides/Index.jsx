import React from 'react';
import PropTypes from 'prop-types';

import Static from './Static';

const selectAside = (template, data) => {
  switch (template) {
    case 'static':
      return <Static {...data} />
    default:
      return null;
  }
};

const Aside = ({ template, title, description }) =>
  selectAside(template, { title, description });


Aside.propTypes = {
  template: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
};


export default Aside;

