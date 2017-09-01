import React from 'react';
import { connect } from 'react-redux';
import path from 'ramda/src/path';
import not from 'ramda/src/not';
import { Link } from 'react-router';

import routes from '../../constants/routes';

import { capitalize, parseDate } from '../../utils';
import { splitAssessorValues } from '../../services';

import QuestionAnswerRow from '../QuestionAnswerRow';

const HealthcareSummaryTable = ({ questionsAnswers, assessmentFinished, assessmentComplete }) => {
  const assessor = splitAssessorValues(questionsAnswers.assessor.answer);
  let withChangeLink = assessmentFinished;

  if (assessmentComplete !== undefined) {
    withChangeLink = not(assessmentComplete);
  }

  return (
    <table className="check-your-answers c-answers-table">
      <thead>
        <tr>
          <th colSpan={withChangeLink ? 3 : 2}>
            <h2 className="heading-medium">Healthcare assessment summary</h2>
          </th>
        </tr>
      </thead>
      <tbody className="c-answers-table-vat">
        <tr data-healthcare-assessor>
          <td>Completed by:</td>
          <td>
            <span data-element-id="healthcare-assessor">{capitalize(assessor.fullName)}</span>
            <br />
            <span data-element-id="healthcare-role">{capitalize(assessor.role)}</span>
            <br />
            <span data-element-id="healthcare-date">
              {parseDate(new Date(assessor.year, assessor.month - 1, assessor.day))}
            </span>
          </td>
          {withChangeLink && (
            <td className="change-answer">
              <Link
                to={`${routes.HEALTHCARE_ASSESSMENT}/${questionsAnswers.assessor.questionId}`}
                data-element-id="change-answer-link"
              >
                Change <span className="visuallyhidden">{questionsAnswers.assessor.question}</span>
              </Link>
            </td>
          )}
        </tr>
        <QuestionAnswerRow
          question={questionsAnswers.outcome.question}
          answer={{ answer: questionsAnswers.outcome.answer }}
          dataTags={{ 'data-element-id': 'healthcare-recommendation' }}
          withChangeAnswer={withChangeLink}
          changeAnswerLink={`${routes.HEALTHCARE_ASSESSMENT}/${questionsAnswers.outcome.questionId}`}
        />
        <QuestionAnswerRow
          question={questionsAnswers.comments.question}
          answer={{ answer: questionsAnswers.comments.answer || 'None' }}
          dataTags={{ 'data-element-id': 'healthcare-comments' }}
          withChangeAnswer={withChangeLink}
          changeAnswerLink={`${routes.HEALTHCARE_ASSESSMENT}/${questionsAnswers.comments.questionId}`}
        />
        <QuestionAnswerRow
          question={questionsAnswers.consent.question}
          answer={questionsAnswers.consent}
          dataTags={{ 'data-element-id': 'healthcare-consent' }}
          withChangeAnswer={withChangeLink}
          changeAnswerLink={`${routes.HEALTHCARE_ASSESSMENT}/${questionsAnswers.consent.questionId}`}
        />
      </tbody>
    </table>
  );
};

const mapStateToProps = state => ({
  questionsAnswers: path([state.offender.selected.id, 'questions'], state.assessments.healthcare),
  assessmentFinished: not(path(['offender', 'selected', 'healthAssessmentCompleted'], state)),
});

export default connect(mapStateToProps)(HealthcareSummaryTable);
