import React from 'react';
import { connect } from 'react-redux';
import path from 'ramda/src/path';

import { extractDecision } from '../../services';

import QuestionAndAnswerSummaryTable from '../QuestionAndAnswerSummaryTable';

const RiskAssessmentSummaryTable = props => <QuestionAndAnswerSummaryTable {...props} />;

const mapStateToProps = (state) => {
  const answers = path(
    [state.answers.selectedPrisonerId],
    state.answers.riskAssessment,
  );

  const outcome = state.riskAssessmentStatus.completed.find(
    item => item.nomisId === state.offender.selected.nomisId,
  ) || extractDecision({
    questions: state.questions.riskAssessment,
    answers,
    exitPoint: state.riskAssessmentStatus.exitPoint,
  });

  return {
    questionsAnswers: [
      {
        question: 'Recommendation:',
        answer: { answer: outcome.recommendation },
        dataTags: { 'data-risk-assessment-outcome': true },
      },
      {
        question: 'How they feel about sharing a cell:',
        answer: answers['how-do-you-feel'] ? { answer: answers['how-do-you-feel'].comments || 'No comments' } : undefined,
        dataTags: { 'data-risk-assessment-feeling': true },
      },
      {
        question: 'Have they indicated they’d seriously hurt a cellmate:',
        answer: answers['prison-self-assessment'],
        dataTags: { 'data-risk-assessment-harm': true },
      },
      {
        question: 'Vulnerable:',
        answer: answers.vulnerability,
        dataTags: { 'data-risk-assessment-vulnerability': true },
      },
      {
        question: 'In a gang, or likely to join one:',
        answer: answers['gang-affiliation'],
        dataTags: { 'data-risk-assessment-gang': true },
      },
      {
        question: 'Drugs:',
        answer: answers['drug-misuse'],
        dataTags: { 'data-risk-assessment-narcotics': true },
      },
      {
        question: 'Hostile or prejudiced views:',
        answer: answers.prejudice,
        dataTags: { 'data-risk-assessment-prejudice': true },
      },
      {
        question: 'Any other reasons they should have single cell:',
        answer: answers['officers-assessment'],
        dataTags: { 'data-risk-assessment-officer-comments': true },
      },
    ],
  };
};

export default connect(mapStateToProps)(RiskAssessmentSummaryTable);
