/* eslint-disable import/no-duplicates */
import AdminPage from './pages/Admin.page';
import { givenThatTheOfficerIsSignedIn } from './tasks/officerSignsIn.task';
import {
  whenPrisonerIsAssessed as whenAPrisonerWhoMayHurtSomeoneIsAssessed,
  thenTheAssessmentIsCompleted,
} from './helpers/complete-risk-assessment';

const assessmentConfig = {
  prisoner: {
    nomisId: 'J1234LO',
    name: 'John Lowe',
    dob: '1 October 1970',
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
  before(() => {
    AdminPage.visit();
    expect(AdminPage.mainHeading).to.equal('Admin');
    AdminPage.loadTestUsers();
  });

  it('Assesses a prisoner who may hurt someone', () => {
    givenThatTheOfficerIsSignedIn();
    whenAPrisonerWhoMayHurtSomeoneIsAssessed(assessmentConfig);
    thenTheAssessmentIsCompleted(assessmentConfig);
  });
});
