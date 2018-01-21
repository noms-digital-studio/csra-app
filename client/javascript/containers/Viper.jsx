import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid/v4';

const Viper = ({
  content,
  onSubmit,
  viperScore,
  isComplete,
  section,
}) => {
  return (
    <div>
      <div className="grid-row">
        <div className="column-two-thirds">
          <h1 data-title={section} className="heading-large">{content[viperScore].title}</h1>
          <div
            dangerouslySetInnerHTML={{ __html: content[viperScore].description }}
          />

          <form className="c-confirmation-form" onSubmit={onSubmit} key={uuid()}>
            <p>
              <input
                type="submit"
                className="button"
                value={isComplete ? 'Save' : 'Continue to questions'}
                data-element-id="continue-button"
              />
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

Viper.propTypes = {
  section: PropTypes.string,
  content: PropTypes.object,
  onSubmit: PropTypes.func,
  viperScore: PropTypes.string,
  isComplete: PropTypes.bool,
};

Viper.defaultProps = {
  formDefaults: {
    confirmation: '',
  },
  viperScore: 'unknown',
};

export default Viper;
