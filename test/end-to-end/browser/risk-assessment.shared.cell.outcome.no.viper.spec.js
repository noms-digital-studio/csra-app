import AdminPage from './pages/Admin.page';
import { givenThatTheOfficerIsSignedIn } from './tasks/officerSignsIn.task';
import {
  whenPrisonerIsAssessed as whenAPrisonerWithNoViperIsAssessed,
  thenTheAssessmentIsCompleted,
} from './helpers/complete-risk-assessment';

const assessmentConfig = {
  prisoner: {
    nomisId: 'J6285NE',
    name: 'James Neo',
    dob: '3 December 1958',
  },
  viperScore: -1,
  initialRecommendation: 'No predictor data available',
  finalRecommendation: 'shared cell',
  answers: {
    harmCellMate: 'no',
    vulnerability: 'no',
    gangAffiliation: 'no',
    drugMisuse: 'no',
    prejudice: 'no',
    officersAssessment: 'no',
  },
};

describe('Risk assessment for a prisoner with no VIPER score (shared cell outcome)', () => {
  before(() => {
    AdminPage.visit();
    expect(AdminPage.mainHeading).to.equal('Admin');
    AdminPage.loadTestUsers();
  });

  it('Assesses a prisoner with no viper score', () => {
    givenThatTheOfficerIsSignedIn();
    whenAPrisonerWithNoViperIsAssessed(assessmentConfig);
    thenTheAssessmentIsCompleted(assessmentConfig);
  });
});
