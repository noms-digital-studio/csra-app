/* eslint-disable import/no-duplicates */
import givenThatTheOfficerIsSignedIn from './tasks/officerSignsIn.task';
import whenTheOfficerAddsThePrisonersDetails from './tasks/theOfficerAddsThePrisonersDetails.task';
import {
  whenPrisonerIsAssessed as whenAPrisonerWhoMayHurtSomeoneIsAssessed,
  thenTheAssessmentIsCompleted,
} from './helpers/complete-risk-assessment';

const assessmentConfig = {
  prisoner: {
    nomisId: 'J1234LO',
    name: 'John Lowe',
    dateOfBirth: '01 October 1970',
  },
  viperScore: 0.35,
  initialRecommendation: 'The predictor has found this person in its records',
  finalRecommendation: 'single cell',
  answers: {
    harmCellMate: 'yes',
    vulnerability: 'no',
    gangAffiliation: 'no',
    drugMisuse: 'no',
    prejudice: 'no',
    officersAssessment: 'no',
  },
  reasons: [
    { questionId: 'harm-cell-mate', reason: 'Officer thinks they might seriously hurt cellmate' },
  ],
};


describe('Risk assessment for a prisoner who may hurt someone (single cell outcome)', () => {
  it('Assesses a prisoner who may hurt someone', () => {
    givenThatTheOfficerIsSignedIn();
    whenTheOfficerAddsThePrisonersDetails();
    whenAPrisonerWhoMayHurtSomeoneIsAssessed(assessmentConfig);
    thenTheAssessmentIsCompleted(assessmentConfig);
  });
});
