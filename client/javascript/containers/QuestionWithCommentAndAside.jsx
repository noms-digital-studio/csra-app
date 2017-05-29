import React, { PropTypes } from 'react';
import uuid from 'uuid/v4';

import Aside from '../components/asides/Index';
import SelectableInputWithCommentGroup
  from '../components/SelectableInputWithCommentGroup';

const QuestionWithAside = ({
  title,
  description,
  aside,
  onSubmit,
  formDefaults,
  answerRequired,
  formFields: { input: { yes, no } },
  isComplete,
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
        <h1 className="heading-large">{title}</h1>
        <div dangerouslySetInnerHTML={{ __html: description }} />

        <div className="form-group">
          <fieldset>
            <SelectableInputWithCommentGroup
              default={formDefaults.answer}
              type="radio"
              fields={[
                {
                  value: 'yes',
                  text: yes.text,
                  name: 'answer',
                  commentValue: formDefaults['reasons-yes'],
                  required: answerRequired,
                },
                {
                  value: 'no',
                  text: no.text,
                  name: 'answer',
                  commentValue: formDefaults['reasons-no'],
                  required: answerRequired,
                },
              ]}
            />
          </fieldset>
        </div>

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
    <div className="column-third">
      <Aside {...aside} />
    </div>
  </div>
);

QuestionWithAside.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  aside: PropTypes.object,
  onSubmit: PropTypes.func,
  formDefaults: PropTypes.shape({
    answer: PropTypes.string,
  }),
  formFields: PropTypes.object,
  answerRequired: PropTypes.bool,
  isComplete: PropTypes.bool,
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
