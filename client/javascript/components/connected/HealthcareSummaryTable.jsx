import React from 'react';
import { connect } from 'react-redux';
import path from 'ramda/src/path';
import QuestionAnswerRow from '../QuestionAnswerRow';
import { capitalize, parseDate } from '../../utils';
import { splitAssessorValues } from '../../services';

const HealthcareSummaryTable = ({ questionAnswers }) => {
  const assessor = splitAssessorValues(questionAnswers.assessor.answer);

  return (
    <table className="check-your-answers c-answers-table">
      <thead>
        <tr>
          <th colSpan="2">
            <h2 className="heading-medium">Healthcare assessment summary</h2>
          </th>
        </tr>
      </thead>
      <tbody className="c-answers-table-vat">
        <tr data-healthcare-assessor>
          <td className="heading-small">Completed by:</td>
          <td>
            <span data-element-id="healthcare-assessor">
              {capitalize(assessor.fullName)}
            </span>
            <br />
            <span data-element-id="healthcare-role">
              {capitalize(assessor.role)}
            </span>
            <br />
            <span data-element-id="healthcare-date">
              {parseDate(new Date(assessor.year, assessor.month - 1, assessor.day))}
            </span>
          </td>
        </tr>
        <QuestionAnswerRow
          question={questionAnswers.outcome.question}
          answer={{ answer: questionAnswers.outcome.answer }}
          dataTags={{ 'data-element-id': 'healthcare-outcome' }}
        />
        <QuestionAnswerRow
          question={questionAnswers.comments.question}
          answer={{ answer: questionAnswers.comments.comments || 'No comments' }}
          dataTags={{ 'data-element-id': 'healthcare-comments' }}
        />
        <QuestionAnswerRow
          question={questionAnswers.consent.question}
          answer={questionAnswers.consent}
          dataTags={{ 'data-element-id': 'healthcare-consent' }}
        />
      </tbody>
    </table>
  );
};

const mapStateToProps = state => ({
  questionAnswers: path([state.offender.selected.id, 'questions'], state.assessments.healthcare),
});

export default connect(mapStateToProps)(HealthcareSummaryTable);
