import React from 'react';
import { connect } from 'react-redux';
import path from 'ramda/src/path';
import not from 'ramda/src/not';

import routes from '../../constants/routes';
import { getUserDetailsFromDocument, parseDate, extractDateFromUTCString } from '../../utils';

import QuestionAndAnswerSummaryTable from '../QuestionAndAnswerSummaryTable';

const RiskAssessmentSummaryTable = props => <QuestionAndAnswerSummaryTable {...props} />;

const getAssessmentTimeStamp = (assessments = [], id) => {
  const assessment = assessments.find(el => el.id === id);
  if (assessment) {
    return extractDateFromUTCString(assessment.updatedAt);
  }

  return parseDate(new Date());
};

const mapStateToProps = (state, props) => {
  const questionsAnswers = path([state.offender.selected.id, 'questions'], state.assessments.risk);
  const name = path([state.offender.selected.id, 'name'], state.assessments.risk) || getUserDetailsFromDocument().name;
  const date = getAssessmentTimeStamp(state.offender.assessments, state.offender.selected.id);

  let withChangeOption = not(path(['offender', 'selected', 'riskAssessmentCompleted'], state));

  if (props.assessmentComplete !== undefined) {
    withChangeOption = not(props.assessmentComplete);
  }

  return {
    withChangeAnswerOption: withChangeOption,
    completedBy: {
      name,
      date,
    },
    questionsAnswers: [
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
