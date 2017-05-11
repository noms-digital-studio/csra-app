import React, { PropTypes } from 'react';
import uuid from 'uuid/v4';

import Aside from '../components/asides/Index';
import SelectableInputGroup from '../components/SelectableInputGroup';

const QuestionWithAside = (
  {
    title,
    description,
    aside,
    onSubmit,
    formDefaults,
    answerRequired,
    formFields: { input: { yes, no } },
  },
) => (
  <div className="grid-row">
    <div className="column-two-thirds">
      <form
        key={uuid()}
        action="/"
        method="post"
        className="form"
        onSubmit={onSubmit}
      >
        <h1 className="heading-large">{title}</h1>
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
            />
          </fieldset>
        </div>

        <p>
          <input type="submit" className="button" value="Save and continue" />
        </p>
      </form>
    </div>
    <div className="column-third">
      <Aside {...aside} />
    </div>
  </div>
);

QuestionWithAside.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  aside: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  formDefaults: PropTypes.shape({
    answer: PropTypes.string,
  }),
  formFields: PropTypes.object,
  answerRequired: PropTypes.bool,
};

QuestionWithAside.defaultProps = {
  formDefaults: { answer: '' },
  formFields: {
    input: {
      yes: '',
      no: '',
    },
  },
  answerRequired: false,
};

export default QuestionWithAside;
