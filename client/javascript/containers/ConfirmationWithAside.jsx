import React, { PropTypes } from 'react';
import uuid from 'uuid/v4';

import SelectableInput from '../components/SelectableInput';
import Aside from '../components/asides/Index';

const ConfirmationWithAside = ({
  title,
  description,
  aside,
  onSubmit,
  formDefaults: { confirmation },
  isComplete,
  section,
}) =>
  <div>
    <div className="grid-row">
      <div className="column-two-thirds">
        <h1 data-title={section} className="heading-large">
          {title}
        </h1>

        <div dangerouslySetInnerHTML={{ __html: description }} />

        <form className="c-confirmation-form" onSubmit={onSubmit} key={uuid()}>
          <p className="c-form-label-container u-clear-fix bold">
            <SelectableInput
              required
              type="checkbox"
              id="confirmation"
              value="accepted"
              text="I confirm this has been explained and the prisoner understands."
              name="confirmation"
              selected={confirmation === 'accepted'}
            />
          </p>
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
      <div className="column-third">
        <Aside {...aside} />
      </div>
    </div>
  </div>;

ConfirmationWithAside.propTypes = {
  section: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  onSubmit: PropTypes.func,
  aside: PropTypes.object,
  formDefaults: PropTypes.shape({
    confirmation: PropTypes.string,
  }),
  isComplete: PropTypes.bool,
};

ConfirmationWithAside.defaultProps = {
  formDefaults: {
    confirmation: '',
  },
};

export default ConfirmationWithAside;
