import React, { PropTypes } from 'react';
import QuestionAnswerRow from './QuestionAnswerRow';

const QnASummaryTable = ({ title, questionsAnswers }) => (
  <table className="check-your-answers c-answers-table">
    <thead>
      <tr>
        <th colSpan="2">
          <h2 className="heading-medium">
            {title}
          </h2>
        </th>
      </tr>
    </thead>

    <tbody className="c-answers-table-vat">
      {questionsAnswers.map((qna, index) => (
        <QuestionAnswerRow {...qna} key={index} />
      ))}
    </tbody>
  </table>
);

QnASummaryTable.propTypes = {
  title: PropTypes.string,
  questionsAnswers: PropTypes.arrayOf(
    PropTypes.shape({
      question: PropTypes.string,
      answer: PropTypes.shape({
        answer: PropTypes.string,
        comments: PropTypes.string,
      }),
      dataTags: PropTypes.object,
    }),
  ),
};

QnASummaryTable.defaultProps = {
  questionsAnswers: [],
};

export default QnASummaryTable;
