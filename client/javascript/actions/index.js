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
  SAVE_RISK_ASSESSMENT_ANSWER,
  SAVE_HEALTHCARE_ANSWER,
  COMPLETE_RISK_ASSESSMENT,
  COMPLETE_HEALTH_ASSESSMENT,
  HEALTHCARE_ANSWERS_COMPLETE,
  SAVE_OUTCOME,
} from '../constants/actions';

import riskAssessmentQuestions
  from '../fixtures/risk-assessment-questions.json';
import healthAssessmentQuestions from '../fixtures/healthcare-questions.json';

import { viperScores } from '../services';

export const getRiskAssessmentQuestions = (data = riskAssessmentQuestions) => ({
  type: GET_RISK_ASSESSMENT_QUESTIONS,
  payload: data,
});

export const getHealthAssessmentQuestions = (
  data = healthAssessmentQuestions,
) => ({
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

export const confirmPrisoner = (prisonerData) => {
  const prisoner = {
    id: prisonerData.id,
    nomisId: prisonerData['nomis-id'],
    surname: prisonerData['last-name'],
    forename: prisonerData['first-name'],
    dateOfBirth: `${prisonerData['dob-day']}-${prisonerData['dob-month']}-${prisonerData['dob-year']}`,
  };

  return { type: CONFIRM_PRISONER, payload: prisoner };
};

export const saveRiskAssessmentAnswer = (key, value) => ({
  type: SAVE_RISK_ASSESSMENT_ANSWER,
  payload: { [key]: value },
});

export const saveHealthcareAssessmentAnswer = (key, value) => ({
  type: SAVE_HEALTHCARE_ANSWER,
  payload: { [key]: value },
});

export const completeRiskAssessmentFor = ({
  recommendation,
  nomisId,
  assessmentId,
  reasons,
  rating,
}) => ({
  type: COMPLETE_RISK_ASSESSMENT,
  payload: { recommendation, nomisId, assessmentId, reasons, rating },
});

export const completeHealthAssessmentFor = ({ nomisId, assessmentId, recommendation }) => ({
  type: COMPLETE_HEALTH_ASSESSMENT,
  payload: { nomisId, assessmentId, recommendation },
});

export const completeHealthAnswersFor = ({ nomisId }) => ({
  type: HEALTHCARE_ANSWERS_COMPLETE,
  payload: { nomisId },
});

export const storeOutcome = ({ nomisId, outcome }) => ({
  type: SAVE_OUTCOME,
  payload: { nomisId, outcome },
});
