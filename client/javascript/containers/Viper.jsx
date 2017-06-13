import React, { PropTypes } from 'react';
import uuid from 'uuid/v4';

const Viper = ({
  content,
  onSubmit,
  formDefaults: { confirmation },
  viperScore,
  isComplete,
}) => {
  return (
    <div>
      <div className="grid-row">
        <div className="column-two-thirds">
          <h1 className="heading-large">{content[viperScore].title}</h1>
          <div
            dangerouslySetInnerHTML={{ __html: content[viperScore].description }}
          />

          <form className="c-confirmation-form" onSubmit={onSubmit} key={uuid()}>
            <p>
              <input
                type="submit"
                className="button"
                value={isComplete ? 'Save' : 'Save and continue'}
                data-continue-button
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
  aside: PropTypes.object,
  formDefaults: PropTypes.shape({
    confirmation: PropTypes.string,
  }),
  rating: PropTypes.string,
  isComplete: PropTypes.bool,
};

Viper.defaultProps = {
  formDefaults: {
    confirmation: '',
  },
  aside: {},
  rating: 'unknown',
};

export default Viper;
