import React from 'react';
import { connect } from 'react-redux';
import path from 'ramda/src/path';
import not from 'ramda/src/not';

import routes from '../../constants/routes';

import QuestionAndAnswerSummaryTable from '../QuestionAndAnswerSummaryTable';

const RiskAssessmentSummaryTable = props => <QuestionAndAnswerSummaryTable {...props} />;

const mapStateToProps = (state, props) => {
  const questionsAnswers = path([state.offender.selected.id, 'questions'], state.assessments.risk);
  let withChangeOption = not(path(['offender', 'selected', 'riskAssessmentCompleted'], state));

  if (props.assessmentComplete !== undefined) {
    withChangeOption = not(props.assessmentComplete);
  }


  return {
    withChangeAnswerOption: withChangeOption,
    questionsAnswers: [
      {
        question: questionsAnswers['how-do-you-feel'].question,
        answer: questionsAnswers['how-do-you-feel'] ? { answer: questionsAnswers['how-do-you-feel'].answer || 'No comments' } : undefined,
        dataTags: { 'data-element-id': 'risk-assessment-feeling' },
        changeAnswerLink: `${routes.RISK_ASSESSMENT}/${questionsAnswers['how-do-you-feel'].questionId}`,
        withChangeAnswer: withChangeOption,
      },
      {
        question: questionsAnswers['harm-cell-mate'].question,
        answer: questionsAnswers['harm-cell-mate'],
        dataTags: { 'data-element-id': 'risk-assessment-harm' },
        changeAnswerLink: `${routes.RISK_ASSESSMENT}/${questionsAnswers['harm-cell-mate'].questionId}`,
        withChangeAnswer: withChangeOption,
      },
      {
        question: questionsAnswers['gang-affiliation'].question,
        answer: questionsAnswers['gang-affiliation'],
        dataTags: { 'data-element-id': 'risk-assessment-gang' },
        changeAnswerLink: `${routes.RISK_ASSESSMENT}/${questionsAnswers['gang-affiliation'].questionId}`,
        withChangeAnswer: withChangeOption,
      },
      {
        question: questionsAnswers['drug-misuse'].question,
        answer: questionsAnswers['drug-misuse'],
        dataTags: { 'data-element-id': 'risk-assessment-narcotics' },
        changeAnswerLink: `${routes.RISK_ASSESSMENT}/${questionsAnswers['drug-misuse'].questionId}`,
        withChangeAnswer: withChangeOption,
      },
      {
        question: questionsAnswers.prejudice.question,
        answer: questionsAnswers.prejudice,
        dataTags: { 'data-element-id': 'risk-assessment-prejudice' },
        changeAnswerLink: `${routes.RISK_ASSESSMENT}/${questionsAnswers.prejudice.questionId}`,
        withChangeAnswer: withChangeOption,
      },
      {
        question: questionsAnswers['officers-assessment'].question,
        answer: questionsAnswers['officers-assessment'],
        dataTags: { 'data-element-id': 'risk-assessment-officer-comments' },
        changeAnswerLink: `${routes.RISK_ASSESSMENT}/${questionsAnswers['officers-assessment'].questionId}`,
        withChangeAnswer: withChangeOption,
      },
    ],
  };
};

export default connect(mapStateToProps)(RiskAssessmentSummaryTable);
