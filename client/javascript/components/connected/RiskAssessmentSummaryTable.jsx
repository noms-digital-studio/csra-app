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
        question: 'How they feel about sharing a cell:',
        answer: answers['how-do-you-feel'] ? { answer: answers['how-do-you-feel'].comments || 'No comments' } : undefined,
        dataTags: { 'data-element-id': 'risk-assessment-feeling' },
      },
      {
        question: 'Have they indicated they’d seriously hurt a cellmate:',
        answer: answers['harm-cell-mate'],
        dataTags: { 'data-element-id': 'risk-assessment-harm' },
      },
      {
        question: 'Vulnerable:',
        answer: answers.vulnerability,
        dataTags: { 'data-element-id': 'risk-assessment-vulnerability' },
      },
      {
        question: 'In a gang, or likely to join one:',
        answer: answers['gang-affiliation'],
        dataTags: { 'data-element-id': 'risk-assessment-gang' },
      },
      {
        question: 'Drugs:',
        answer: answers['drug-misuse'],
        dataTags: { 'data-element-id': 'risk-assessment-narcotics' },
      },
      {
        question: 'Hostile or prejudiced views:',
        answer: answers.prejudice,
        dataTags: { 'data-element-id': 'risk-assessment-prejudice' },
      },
      {
        question: 'Any other reasons they should have single cell:',
        answer: answers['officers-assessment'],
        dataTags: { 'data-element-id': 'risk-assessment-officer-comments' },
      },
    ],
  };
};

export default connect(mapStateToProps)(RiskAssessmentSummaryTable);
