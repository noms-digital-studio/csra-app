import React from 'react';
import { connect } from 'react-redux';
import path from 'ramda/src/path';
import QuestionAnswerRow from '../QuestionAnswerRow';

const riskText = { no: 'shared cell', yes: 'single cell' };

const HealthcareSummaryTable = ({ answers }) => (
  <table className="check-your-answers c-answers-table">
    <thead>
      <tr>
        <th colSpan="2">
          <h2 className="heading-medium">
            Healthcare assessment summary
          </h2>
        </th>
      </tr>
    </thead>
    <tbody className="c-answers-table-vat">
      <QuestionAnswerRow
        question={'Healthcare recommendation:'}
        answer={{ answer: riskText[answers.outcome.answer] }}
        dataTags={{ 'data-healthcare-outcome': true }}
      />
      <QuestionAnswerRow
        question={'Comments from the healthcare form:'}
        answer={{ answer: answers.comments.comments || 'No comments' }}
        dataTags={{ 'data-healthcare-comments': true }}
      />
      <QuestionAnswerRow
        question={'Consent given:'}
        answer={answers.consent}
        dataTags={{ 'data-healthcare-consent': true }}
      />

      <tr data-healthcare-assessor>
        <td className="heading-small">
          Completed by:
        </td>
        <td>
          <span data-assessor>{answers.assessor['full-name']}</span>
          <br />
          <span data-role>{answers.assessor.role}</span>
          <br />
          <span data-date>
            {`${answers.assessor.day}-${answers.assessor.month}-${answers.assessor.year}`}
          </span>
        </td>
      </tr>
    </tbody>
  </table>
);

const mapStateToProps = state => ({
  answers: path([state.answers.selectedPrisonerId], state.answers.healthcare),
});

export default connect(mapStateToProps)(HealthcareSummaryTable);