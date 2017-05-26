import React, { PropTypes } from 'react';
import uuid from 'uuid/v4';
import SelectableInputWithCommentGroup from '../components/SelectableInputWithCommentGroup';

const Question = (
  {
    title,
    description,
    onSubmit,
    formDefaults,
    answerRequired,
    formFields: { input: { yes, no } },
    isComplete,
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
          <input type="submit" className="button" value={isComplete ? 'Save' : 'Save and continue'} data-continue-button/>
        </p>
      </form>
    </div>
  </div>
);

Question.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  aside: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  formDefaults: PropTypes.shape({
    answer: PropTypes.string,
  }),
  formFields: PropTypes.object,
  answerRequired: PropTypes.bool,
  isComplete: PropTypes.bool
};

Question.defaultProps = {
  formDefaults: { answer: '' },
  formFields: {
    input: {
      yes: '',
      no: '',
    },
  },
  answerRequired: false,
};

export default Question;
