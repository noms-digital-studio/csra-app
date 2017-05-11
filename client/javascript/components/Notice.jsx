import React, { PropTypes } from 'react';

const Notice = ({ text }) => (
  <div className="notice">
    <i className="icon icon-important">
      <span className="visually-hidden">Warning</span>
    </i>
    <strong className="">{text}</strong>
  </div>
);


Notice.propTypes = {
  text: PropTypes.string,
};

export default Notice;
