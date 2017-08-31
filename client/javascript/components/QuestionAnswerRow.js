import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import isEmpty from 'ramda/src/isEmpty';
import not from 'ramda/src/not';

import { capitalize } from '../utils';

/* eslint-disable react/prop-types */
const ChangeAnswerColumn = ({
  question,
  changeAnswerLink,
  withChangeAnswer,
  tableHasChangeAnswers,
}) => {
  if (withChangeAnswer) {
    return (
      <td className="change-answer">
        <Link to={changeAnswerLink} data-element-id="change-answer-link">
          Change <span className="visuallyhidden">{question}</span>
        </Link>
      </td>
    );
  }

  if (tableHasChangeAnswers) {
    return <td />;
  }

  return null;
};

// eslint-disable-next-line
const QuestionAnswerRow = ({
  question,
  answer,
  dataTags,
  changeAnswerLink,
  withChangeAnswer,
  tableHasChangeAnswers,
}) => not(isEmpty(answer)) ? (
  <tr>
    <td>{question}</td>
    <td {...dataTags}>
      <p>{capitalize(answer.answer)}</p>
      {answer[`reasons-${answer.answer}`] && (
      <p data-element-id="healthcare-comments">
        <span>“{capitalize(answer[`reasons-${answer.answer}`])}”</span>
      </p>
        )}
    </td>

    <ChangeAnswerColumn
      {...{ withChangeAnswer, question, changeAnswerLink, tableHasChangeAnswers }}
    />
  </tr>
  ) : null;

QuestionAnswerRow.propTypes = {
  question: PropTypes.string,
  tableHasChangeAnswers: PropTypes.bool,
  withChangeAnswer: PropTypes.bool,
  changeAnswerLink: PropTypes.string,
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
