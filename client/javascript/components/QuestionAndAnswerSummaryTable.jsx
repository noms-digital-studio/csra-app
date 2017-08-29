import React, { PropTypes } from 'react';
import QuestionAnswerRow from './QuestionAnswerRow';

const QuestionAndAnswerSummaryTable = ({ title, questionsAnswers, assessmentComplete }) => (
  <table className="check-your-answers c-answers-table">
    <thead>
      <tr>
        <th colSpan={assessmentComplete ? 3 : 2}>
          <h2 className="heading-medium">
            {title}
          </h2>
        </th>
      </tr>
    </thead>

    <tbody className="c-answers-table-vat">
      {questionsAnswers.map((qna, index) => (
        <QuestionAnswerRow tableHasChangeAnswers={assessmentComplete} {...qna} key={index} />
      ))}
    </tbody>
  </table>
);

QuestionAndAnswerSummaryTable.propTypes = {
  title: PropTypes.string,
  assessmentComplete: PropTypes.bool,
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

QuestionAndAnswerSummaryTable.defaultProps = {
  questionsAnswers: [],
  assessmentComplete: false,
};

export default QuestionAndAnswerSummaryTable;
