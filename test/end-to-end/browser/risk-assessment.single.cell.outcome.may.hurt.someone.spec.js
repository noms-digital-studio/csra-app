/* eslint-disable import/no-duplicates */
import givenThatTheOfficerIsSignedIn from './tasks/officerSignsIn.task';
import whenTheOfficerAddsThePrisonersDetails from './tasks/theOfficerAddsThePrisonersDetails.task';
import {
  whenPrisonerIsAssessed as whenAPrisonerWhoMayHurtSomeoneIsAssessed,
  thenTheAssessmentIsCompleted,
} from './helpers/complete-risk-assessment';
import upsertViperTableWith from '../utils/upsertViperTable';

const assessmentConfig = {
  prisoner: {
    nomisId: 'J1234LO',
    name: 'John Lowe',
    dateOfBirth: '01 October 1970',
  },
  viperScore: 0.35,
  initialRecommendation: 'shared cell',
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
    { question_id: 'harm-cell-mate', reason: 'Officer thinks they might seriously hurt cellmate' },
  ],
};


describe('Risk assessment for a prisoner who may hurt someone (single cell outcome)', () => {
  before(() => upsertViperTableWith({ nomisId: 'J1234LO', viperScore: 0.35 }));

  it('Assesses a prisoner who may hurt someone', () => {
    givenThatTheOfficerIsSignedIn();
    whenTheOfficerAddsThePrisonersDetails();
    whenAPrisonerWhoMayHurtSomeoneIsAssessed(assessmentConfig);
    thenTheAssessmentIsCompleted(assessmentConfig);
  });
});
