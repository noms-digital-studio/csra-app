import React from 'react';
import { connect } from 'react-redux';
import path from 'ramda/src/path';
import QuestionAnswerRow from '../QuestionAnswerRow';
import { capitalize } from '../../utils';

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
        question={'Does Healthcare recommend a single cell?:'}
        answer={{ answer: answers.outcome.answer }}
        dataTags={{ 'data-element-id': 'healthcare-outcome' }}
      />
      <QuestionAnswerRow
        question={'Comments from the healthcare form:'}
        answer={{ answer: answers.comments.comments || 'No comments' }}
        dataTags={{ 'data-element-id': 'healthcare-comments' }}
      />
      <QuestionAnswerRow
        question={'Consent given:'}
        answer={answers.consent}
        dataTags={{ 'data-element-id': 'healthcare-consent' }}
      />

      <tr data-healthcare-assessor>
        <td className="heading-small">
          Completed by:
        </td>
        <td>
          <span data-element-id="healthcare-assessor">{capitalize(answers.assessor['full-name'])}</span>
          <br />
          <span data-element-id="healthcare-role">{capitalize(answers.assessor.role)}</span>
          <br />
          <span data-element-id="healthcare-date">
            {`${answers.assessor.day}-${answers.assessor.month}-${answers.assessor.year}`}
          </span>
        </td>
      </tr>
    </tbody>
  </table>
);

const mapStateToProps = state => ({
  answers: path([state.answers.selectedAssessmentId], state.answers.healthcare),
});

export default connect(mapStateToProps)(HealthcareSummaryTable);
