import React from 'react';

const QuestionAnswerRow = ({ question, answer, dataTags }) =>
  (answer
    ? <tr {...dataTags}>
      <td className="heading-small">
        {question}
      </td>
      <td>
        <p>{answer.answer}</p>
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

export default QuestionAnswerRow;
