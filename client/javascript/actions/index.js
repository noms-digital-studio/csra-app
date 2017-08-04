import {
  GET_RISK_ASSESSMENT_QUESTIONS,
  GET_HEALTH_ASSESSMENT_QUESTIONS,
  GET_OFFENDER_ASSESSMENTS,
  GET_VIPER_SCORES,
  ADD_VIPER_SCORE,
  SELECT_OFFENDER,
  SIGN_IN,
  SIGN_OUT,
  ADD_PRISONER,
  CONFIRM_PRISONER,
  SAVE_HEALTHCARE_ANSWER,
  COMPLETE_RISK_ASSESSMENT,
  COMPLETE_HEALTH_ASSESSMENT,
  HEALTHCARE_ANSWERS_COMPLETE,
  STORE_ASSESSMENT,
  START_ASSESSMENT,
  STORE_ASSESSMENT_ANSWER,
  STORE_ASSESSMENT_OUTCOME,
  STORE_ASSESSMENT_REASONS,
} from '../constants/actions';

import riskAssessmentQuestions from '../fixtures/risk-assessment-questions.json';
import healthAssessmentQuestions from '../fixtures/healthcare-questions.json';

import { viperScores, buildQuestionAnswer } from '../services';

export const getRiskAssessmentQuestions = (data = riskAssessmentQuestions) => ({
  type: GET_RISK_ASSESSMENT_QUESTIONS,
  payload: data,
});

export const getHealthAssessmentQuestions = (data = healthAssessmentQuestions) => ({
  type: GET_HEALTH_ASSESSMENT_QUESTIONS,
  payload: data,
});

export const getOffenderAssessments = assessments => ({
  type: GET_OFFENDER_ASSESSMENTS,
  payload: assessments,
});

export const getViperScores = (scores = viperScores()) => ({
  type: GET_VIPER_SCORES,
  payload: scores.output,
});

export const addViperScore = ({ nomisId, viperScore }) => ({
  type: ADD_VIPER_SCORE,
  payload: { nomisId, viperScore },
});

export const selectOffender = offender => ({
  type: SELECT_OFFENDER,
  payload: offender,
});

export const signIn = user => ({ type: SIGN_IN, payload: user });

export const signOut = () => ({ type: SIGN_OUT });

export const addPrisoner = prisoner => ({
  type: ADD_PRISONER,
  payload: prisoner,
});

export const confirmPrisoner = () => ({ type: CONFIRM_PRISONER });

// export const saveHealthcareAssessmentAnswer = (key, value) => ({
//   type: SAVE_HEALTHCARE_ANSWER,
//   payload: { [key]: value },
// });

// export const completeRiskAssessmentFor = ({ recommendation, assessmentId, reasons, rating }) => ({
//   type: COMPLETE_RISK_ASSESSMENT,
//   payload: { recommendation, assessmentId, reasons, rating },
// });

export const storeRiskAssessmentFor = ({ id, assessment }) => ({
  type: STORE_ASSESSMENT,
  payload: { assessmentType: 'risk', id, assessment },
});

export const storeHealthcareAssessmentFor = ({ id, assessment }) => ({
  type: STORE_ASSESSMENT,
  payload: { assessmentType: 'healthcare', id, assessment },
});

export const startHealthcareAssessmentFor = ({ id }) => ({
  type: START_ASSESSMENT,
  payload: { id, assessmentType: 'healthcare', viperScore: null },
});

export const saveHealthcareAssessmentAnswer = ({ id, question, answer }) => ({
  type: STORE_ASSESSMENT_ANSWER,
  payload: { id, questionAnswer: buildQuestionAnswer(question, answer), assessmentType: 'healthcare' },
});

// export const completeHealthAssessmentFor = ({ assessmentId, recommendation }) => ({
//   type: COMPLETE_HEALTH_ASSESSMENT,
//   payload: { assessmentId, recommendation },
// });

export const completeHealthAnswersFor = ({ assessmentId }) => ({
  type: HEALTHCARE_ANSWERS_COMPLETE,
  payload: { assessmentId },
});

export const saveHealthcareAssessmentOutcome = ({ id, outcome }) => ({
  type: STORE_ASSESSMENT_OUTCOME,
  payload: { assessmentType: 'healthcare', id, outcome },
});

export const startRiskAssessmentFor = ({ id, viperScore }) => ({
  type: START_ASSESSMENT,
  payload: { id, assessmentType: 'risk', viperScore },
});

export const saveRiskAssessmentAnswer = ({ id, question, answer }) => ({
  type: STORE_ASSESSMENT_ANSWER,
  payload: { id, questionAnswer: buildQuestionAnswer(question, answer), assessmentType: 'risk' },
});


export const saveRiskAssessmentOutcome = ({ id, outcome }) => ({
  type: STORE_ASSESSMENT_OUTCOME,
  payload: { assessmentType: 'risk', id, outcome },
});

export const saveRiskAssessmentReasons = ({ id, reasons }) => ({
  type: STORE_ASSESSMENT_REASONS,
  payload: { assessmentType: 'risk', id, reasons },
});
