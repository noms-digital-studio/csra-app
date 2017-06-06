import React, { PropTypes } from 'react';
import isEmpty from 'ramda/src/isEmpty';
import not from 'ramda/src/not';
import { capitalize } from '../utils';

const QuestionAnswerRow = ({ question, answer, dataTags }) =>
  (not(isEmpty(answer))
    ? <tr>
      <td className="heading-small">
        {question}
      </td>
      <td {...dataTags}>
        <p>{capitalize(answer.answer)}</p>
        {answer[`reasons-${answer.answer}`] &&
        <p data-comments>
          <span className="heading-small u-d-block">
                Comments
              </span>
          <span>
            {answer[`reasons-${answer.answer}`]}
          </span>
        </p>}
      </td>
    </tr>
    : null);

QuestionAnswerRow.propTypes = {
  question: PropTypes.string,
  answer: PropTypes.shape({
    answer: PropTypes.string,
  }),
  dataTags: PropTypes.objectOf(PropTypes.string),
};

QuestionAnswerRow.defaultProps = {
  question: '',
  answer: {},
  dataTags: {},
};

export default QuestionAnswerRow;
