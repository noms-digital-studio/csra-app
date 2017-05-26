import React, { PropTypes } from 'react';
import uuid from 'uuid/v4';

import SelectableInput from '../components/SelectableInput';

const Confirmation = ({ title, description, onSubmit, formDefaults: { confirmation }, isComplete }) => (
  <div>
    <div className="grid-row">
      <div className="column-two-thirds">
        <h1 className="heading-large">{title}</h1>
        <div dangerouslySetInnerHTML={{ __html: description }} />
      </div>
    </div>
    <div className="grid-row">
      <div className="column-two-thirds">
        <form className="c-confirmation-form" onSubmit={onSubmit} key={uuid()}>
          <p className="c-form-label-container u-clear-fix bold">
            <SelectableInput
              required
              type="checkbox"
              id="confirmation"
              value="accepted"
              text="I confirm this has been explained and they understand"
              name="confirmation"
              selected={confirmation === 'accepted'}
            />
          </p>

          <p>
            <input className="button" type="submit" value={isComplete ? 'Save' : 'Save and continue'} data-continue-button />
          </p>
        </form>
      </div>
    </div>
  </div>
);

Confirmation.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  onSubmit: PropTypes.func,
  formDefaults: PropTypes.shape({
    confirmation: PropTypes.string,
  }),
  isComplete: PropTypes.bool,
};

Confirmation.defaultProps = {
  formDefaults: {
    confirmation: '',
  },
};

export default Confirmation;
