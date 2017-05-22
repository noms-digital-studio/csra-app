import {
  GET_ASSESSMENT_QUESTIONS,
  GET_HEALTH_ASSESSMENT_QUESTIONS,
  GET_OFFENDER_NOMIS_PROFILES,
  GET_VIPER_SCORES,
  SELECT_OFFENDER,
  SIGN_IN,
  SIGN_OUT,
  ADD_PRISONER,
  CONFIRM_PRISONER,
  SAVE_CSRA_ANSWER,
  SAVE_HEALTHCARE_ANSWER,
  COMPLETE_ASSESSMENT,
  SAVE_EXIT_POINT,
  COMPLETE_HEALTH_ASSESSMENT,
  HEALTHCARE_ANSWERS_COMPLETE,
} from '../constants/actions';

import AssessmentQuestions from '../fixtures/csra-questions.json';
import HealthAssessmentQuestions from '../fixtures/healthcare-questions.json';

import { offenderNomisProfiles, viperScores } from '../services';

export const getAssessmentQuestions = (data = AssessmentQuestions) => ({
  type: GET_ASSESSMENT_QUESTIONS,
  payload: data,
});

export const getHealthAssessmentQuestions = (data = HealthAssessmentQuestions) => ({
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
  type: SAVE_CSRA_ANSWER,
  payload: { [key]: value },
});

export const saveHealthcareAssessmentAnswer = (key, value) => ({
  type: SAVE_HEALTHCARE_ANSWER,
  payload: { [key]: value },
});

export const completeAssessmentFor = outcome => ({
  type: COMPLETE_ASSESSMENT,
  payload: outcome,
});

export const saveExitPoint = riskFactor => ({
  type: SAVE_EXIT_POINT,
  payload: riskFactor,
});

export const completeHealthAssessmentFor = offender => ({
  type: COMPLETE_HEALTH_ASSESSMENT,
  payload: offender,
});

export const completeHealthAnswersFor = offender => ({
  type: HEALTHCARE_ANSWERS_COMPLETE,
  payload: offender,
});
