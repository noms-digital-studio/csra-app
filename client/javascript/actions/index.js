import {
  GET_RISK_ASSESSMENT_QUESTIONS,
  GET_HEALTH_ASSESSMENT_QUESTIONS,
  GET_OFFENDER_NOMIS_PROFILES,
  GET_VIPER_SCORES,
  SELECT_OFFENDER,
  SIGN_IN,
  SIGN_OUT,
  ADD_PRISONER,
  CONFIRM_PRISONER,
  SAVE_RISK_ASSESSMENT_ANSWER,
  SAVE_HEALTHCARE_ANSWER,
  COMPLETE_RISK_ASSESSMENT,
  SAVE_EXIT_POINT,
  CLEAR_EXIT_POINT,
  COMPLETE_HEALTH_ASSESSMENT,
  HEALTHCARE_ANSWERS_COMPLETE,
  CLEAR_RISK_ASSESSMENT_ANSWERS,
  SAVE_OUTCOME,
} from '../constants/actions';

import riskAssessmentQuestions
  from '../fixtures/risk-assessment-questions.json';
import healthAssessmentQuestions from '../fixtures/healthcare-questions.json';

import { offenderNomisProfiles, viperScores } from '../services';

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

export const getOffenderNomisProfiles = (
  profiles = offenderNomisProfiles(),
) => ({
  type: GET_OFFENDER_NOMIS_PROFILES,
  payload: profiles.output,
});

export const getViperScores = (scores = viperScores()) => ({
  type: GET_VIPER_SCORES,
  payload: scores.output,
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
    nomisId: prisonerData['nomis-id'],
    surname: prisonerData['last-name'],
    firstName: prisonerData['first-name'],
    dob: `${prisonerData['dob-day']}-${prisonerData['dob-month']}-${prisonerData['dob-year']}`,
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

export const completeRiskAssessmentFor = ({ recommendation, nomisId, assessmentId }) => ({
  type: COMPLETE_RISK_ASSESSMENT,
  payload: { recommendation, nomisId, assessmentId },
});

export const saveExitPoint = riskFactor => ({
  type: SAVE_EXIT_POINT,
  payload: riskFactor,
});

export const clearExitPoint = () => ({ type: CLEAR_EXIT_POINT });

export const completeHealthAssessmentFor = ({ nomisId, assessmentId }) => ({
  type: COMPLETE_HEALTH_ASSESSMENT,
  payload: { nomisId, assessmentId },
});

export const completeHealthAnswersFor = ({ nomisId }) => ({
  type: HEALTHCARE_ANSWERS_COMPLETE,
  payload: { nomisId },
});

export const clearAnswers = nomisId => ({
  type: CLEAR_RISK_ASSESSMENT_ANSWERS,
  payload: nomisId,
});

export const storeOutcome = ({ nomisId, outcome }) => ({
  type: SAVE_OUTCOME,
  payload: { nomisId, outcome },
});
