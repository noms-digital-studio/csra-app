import React, { PropTypes } from 'react';
import uuid from 'uuid/v4';

const Viper = ({
  content,
  onSubmit,
  viperScore,
  isComplete,
}) => {
  return (
    <div>
      <div className="grid-row">
        <div className="column-two-thirds">
          <h1 data-title="viper" className="heading-large">{content[viperScore].title}</h1>
          <div
            dangerouslySetInnerHTML={{ __html: content[viperScore].description }}
          />

          <form className="c-confirmation-form" onSubmit={onSubmit} key={uuid()}>
            <p>
              <input
                type="submit"
                className="button"
                value={isComplete ? 'Save' : 'Save and continue'}
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
