import React from 'react';
import { connect } from 'react-redux';
import path from 'ramda/src/path';

import { calculateRiskFor as viperScoreFor } from '../../services';

import QNASummaryTable from '../QNASummaryTable';


const extractDecision = (questions, exitPoint, viperScore) => {
  if (exitPoint) {
    const question = questions.find(item => item.section === exitPoint);
    return {
      recommendation: 'Single cell',
      rating: 'high',
      reasons: question.sharedCellPredicate.reasons,
    };
  }

  if (viperScore === 'unknown') {
    return {
      recommendation: 'Single cell',
      rating: 'unknown',
      reasons: [
        'Based on the fact that a Viper Score was not available for you.',
      ],
    };
  }

  return {
    recommendation: 'Shared cell',
    rating: 'low',
    reasons: [
      'Take into consideration any prejudices and hostile views. Ensure that the nature of these views is taken into account when allocating a cell mate. Inform the keyworker to monitor the impact on other prisoners.',
    ],
  };
};

const RiskAssessmentSummaryTable = props => <QNASummaryTable {...props} />;

const mapStateToProps = (state) => {
  const answers = path(
    [state.answers.selectedPrisonerId],
    state.answers.riskAssessment,
  );

  const outcome = extractDecision(
    state.questions.riskAssessment,
    state.riskAssessmentStatus.exitPoint,
    viperScoreFor(state.offender.selected.nomisId, state.offender.viperScores),
  );

  return {
    questionsAnswers: [
      {
        question: 'Initial recommendation:',
        answer: { answer: outcome.recommendation },
        dataTags: { 'data-risk-assessment-outcome': true },
      },
      {
        question: 'How they feel about sharing a cell:',
        answer: { answer: answers['how-do-you-feel'].comments || 'No Comment' },
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
        question: 'Drug or alcohol dependent:',
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
        answer: answers.prejudice,
        dataTags: { 'data-risk-assessment-officer-comments': true },
      },
    ],
  };
};

export default connect(mapStateToProps)(RiskAssessmentSummaryTable);
