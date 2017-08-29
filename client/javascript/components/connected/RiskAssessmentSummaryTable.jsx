import React from 'react';
import { connect } from 'react-redux';
import path from 'ramda/src/path';

import QuestionAndAnswerSummaryTable from '../QuestionAndAnswerSummaryTable';

const RiskAssessmentSummaryTable = props => <QuestionAndAnswerSummaryTable {...props} />;

const mapStateToProps = (state) => {
  const answers = path([state.offender.selected.id, 'questions'], state.assessments.risk);

  return {
    questionsAnswers: [
      {
        question: answers['how-do-you-feel'].question,
        answer: answers['how-do-you-feel']
          ? { answer: answers['how-do-you-feel'].answer || 'No comments' }
          : undefined,
        dataTags: { 'data-element-id': 'risk-assessment-feeling' },
      },
      {
        question: answers['harm-cell-mate'].question,
        answer: answers['harm-cell-mate'],
        dataTags: { 'data-element-id': 'risk-assessment-harm' },
      },
      {
        question: answers.vulnerability.question,
        answer: answers.vulnerability,
        dataTags: { 'data-element-id': 'risk-assessment-vulnerability' },
      },
      {
        question: answers['gang-affiliation'].question,
        answer: answers['gang-affiliation'],
        dataTags: { 'data-element-id': 'risk-assessment-gang' },
      },
      {
        question: answers['drug-misuse'].question,
        answer: answers['drug-misuse'],
        dataTags: { 'data-element-id': 'risk-assessment-narcotics' },
      },
      {
        question: answers['drug-misuse'].question,
        answer: answers.prejudice,
        dataTags: { 'data-element-id': 'risk-assessment-prejudice' },
      },
      {
        question: answers['officers-assessment'].question,
        answer: answers['officers-assessment'],
        dataTags: { 'data-element-id': 'risk-assessment-officer-comments' },
      },
    ],
  };
};

export default connect(mapStateToProps)(RiskAssessmentSummaryTable);
