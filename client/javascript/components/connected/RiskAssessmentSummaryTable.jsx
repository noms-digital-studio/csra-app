import React from 'react';
import { connect } from 'react-redux';
import path from 'ramda/src/path';

import QuestionAndAnswerSummaryTable from '../QuestionAndAnswerSummaryTable';

const RiskAssessmentSummaryTable = props => <QuestionAndAnswerSummaryTable {...props} />;

const mapStateToProps = (state) => {
  const questionsAnswers = path([state.offender.selected.id, 'questions'], state.assessments.risk);

  return {
    questionsAnswers: [
      {
        question: questionsAnswers['how-do-you-feel'].question,
        answer: questionsAnswers['how-do-you-feel']
          ? { answer: questionsAnswers['how-do-you-feel'].answer || 'No comments' }
          : undefined,
        dataTags: { 'data-element-id': 'risk-assessment-feeling' },
      },
      {
        question: questionsAnswers['harm-cell-mate'].question,
        answer: questionsAnswers['harm-cell-mate'],
        dataTags: { 'data-element-id': 'risk-assessment-harm' },
      },
      {
        question: questionsAnswers.vulnerability.question,
        answer: questionsAnswers.vulnerability,
        dataTags: { 'data-element-id': 'risk-assessment-vulnerability' },
      },
      {
        question: questionsAnswers['gang-affiliation'].question,
        answer: questionsAnswers['gang-affiliation'],
        dataTags: { 'data-element-id': 'risk-assessment-gang' },
      },
      {
        question: questionsAnswers['drug-misuse'].question,
        answer: questionsAnswers['drug-misuse'],
        dataTags: { 'data-element-id': 'risk-assessment-narcotics' },
      },
      {
        question: questionsAnswers['drug-misuse'].question,
        answer: questionsAnswers.prejudice,
        dataTags: { 'data-element-id': 'risk-assessment-prejudice' },
      },
      {
        question: questionsAnswers['officers-assessment'].question,
        answer: questionsAnswers['officers-assessment'],
        dataTags: { 'data-element-id': 'risk-assessment-officer-comments' },
      },
    ],
  };
};

export default connect(mapStateToProps)(RiskAssessmentSummaryTable);
