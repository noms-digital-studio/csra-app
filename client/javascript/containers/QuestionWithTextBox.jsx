import React, { PropTypes } from 'react';
import uuid from 'uuid/v4';

import SelectableInputGroup from '../components/SelectableInputGroup';
import CommentBox from '../components/CommentBox';

const QuestionWithComments = ({
  title,
  section,
  description,
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
            />
          </fieldset>
        </div>
        <div>
          <label
            className="c-radio-comment__label"
            htmlFor="reason-for-answer"
          >
            Explain the reasons for your answer.
          </label>

          <CommentBox
            limit={300}
            id="reason-for-answer"
            name="reasons-for-answer"
            text={formDefaults['reasons-for-answer'] || formDefaults['reasons-yes'] || formDefaults['reasons-no']}
            cssClassName="form-control form-control-3-4"
          />
        </div>

        <div>
          <button
            type="submit"
            className="button"
            data-element-id="continue-button"
          >
            {isComplete ? 'Save' : 'Save and continue'}
          </button>
        </div>
      </form>
    </div>
  </div>
);

QuestionWithComments.propTypes = {
  section: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  aside: PropTypes.object,
  onSubmit: PropTypes.func,
  formDefaults: PropTypes.shape({
    answer: PropTypes.string,
    comments: PropTypes.string,
  }),
  isComplete: PropTypes.bool,
  answerRequired: PropTypes.bool,
  commentLabel: PropTypes.string,
  formFields: PropTypes.shape({
    input: PropTypes.shape({
      yes: PropTypes.shape({
        text: PropTypes.string,
      }),
      no: PropTypes.shape({
        text: PropTypes.string,
      }),
    }),
  }),
};

QuestionWithComments.defaultProps = {
  formFields: {
    input: {
      yes: { text: '' },
      no: { text: '' },
    },
  },
  formDefaults: {
    answer: '',
    'reasons-for-answer': '',
  },
  onSubmit: () => {},
  aside: {},
};

export default QuestionWithComments;
