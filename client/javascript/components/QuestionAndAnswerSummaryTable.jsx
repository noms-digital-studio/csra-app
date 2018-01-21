import React from 'react';
import PropTypes from 'prop-types';

import QuestionAnswerRow from './QuestionAnswerRow';

const QuestionAndAnswerSummaryTable = ({ title, questionsAnswers, withChangeAnswerOption, completedBy }) => (
  <table className="check-your-answers c-answers-table">
    <thead>
      <tr>
        <th colSpan={withChangeAnswerOption ? 3 : 2}>
          <h2 className="heading-medium">
            {title}
          </h2>
        </th>
      </tr>
    </thead>

    <tbody className="c-answers-table-vat">
      <tr>
        <td>Completed by:</td>
        <td data-element-id="completed-by">
          {completedBy.name} <br />
          {completedBy.date}
        </td>
        {withChangeAnswerOption && (<td />) }
      </tr>
      {questionsAnswers.map((qna, index) => (
        <QuestionAnswerRow tableHasChangeAnswers={withChangeAnswerOption} {...qna} key={index} />
      ))}
    </tbody>
  </table>
);

QuestionAndAnswerSummaryTable.propTypes = {
  title: PropTypes.string,
  withChangeAnswerOption: PropTypes.bool,
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
  completedBy: PropTypes.shape({
    name: PropTypes.string,
    date: PropTypes.date,
  }),
};

QuestionAndAnswerSummaryTable.defaultProps = {
  questionsAnswers: [],
  withChangeAnswerOption: false,
  completedBy: {},
};

export default QuestionAndAnswerSummaryTable;
