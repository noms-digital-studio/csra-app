import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid/v4';

import Aside from '../components/asides/Index';
import SelectableInputGroup from '../components/SelectableInputGroup';

const QuestionWithAside = ({
  section,
  title,
  description,
  aside,
  onSubmit,
  formDefaults,
  answerRequired,
  isComplete,
  formFields: { input: { yes, no } },
}) => (
  <div className="grid-row">
    <div className="column-two-thirds">
      <form
        key={uuid()}
        action="/"
        method="post"
        className="form"
        onSubmit={onSubmit}
      >
        <h1 data-title={section} className="heading-large">{title}</h1>
        <div dangerouslySetInnerHTML={{ __html: description }} />

        <div className="form-group">
          <fieldset>
            <SelectableInputGroup
              default={formDefaults.answer}
              type="radio"
              fields={[
                {
                  value: 'yes',
                  text: yes.text,
                  name: 'answer',
                  required: answerRequired,
                },
                {
                  value: 'no',
                  text: no.text,
                  name: 'answer',
                  required: answerRequired,
                },
              ]}
              data-yes-no-radio-group
            />
          </fieldset>
        </div>
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
);

QuestionWithAside.propTypes = {
  section: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  onSubmit: PropTypes.func,
  formDefaults: PropTypes.shape({
    answer: PropTypes.string,
  }),
  formFields: PropTypes.object,
  aside: PropTypes.object,
  answerRequired: PropTypes.bool,
  isComplete: PropTypes.bool,
};

QuestionWithAside.defaultProps = {
  formDefaults: { answer: '' },
  formFields: {
    input: {
      yes: { text: '' },
      no: { text: '' },
    },
  },
  isComplete: false,
  answerRequired: false,
};

export default QuestionWithAside;
