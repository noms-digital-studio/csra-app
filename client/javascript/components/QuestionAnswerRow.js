import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';
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
  <tr {...dataTags}>
    <td>{question}</td>
    <td>
      <p data-element-id="row-answer">{capitalize(answer.answer)}</p>
      {answer[`reasons-${answer.answer}`] && (
        <p data-element-id="row-comments"><span>“{capitalize(answer[`reasons-${answer.answer}`])}”</span></p>
      )}
      {answer['reasons-for-answer'] && (
        <p><span>“{capitalize(answer['reasons-for-answer'])}”</span></p>
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
