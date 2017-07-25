import AdminPage from './pages/Admin.page';
import { givenThatTheOfficerIsSignedIn } from './tasks/officerSignsIn.task';
import {
  whenPrisonerIsAssessed,
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
    harmCellMate: 'no',
    vulnerability: 'no',
    gangAffiliation: 'no',
    drugMisuse: 'no',
    prejudice: 'no',
    officersAssessment: 'yes',
  },

  reasons: [
    { question_id: 'officers-assessment', reason: 'Officer recommends a single cell' },
  ],
};

describe('Risk assessment for a prisoner with no VIPER score (shared cell outcome)', () => {
  before(() => {
    AdminPage.visit();
    expect(AdminPage.mainHeading).to.equal('Admin');
    AdminPage.loadTestUsers();
  });

  it('Assesses a prisoner with no viper score', () => {
    givenThatTheOfficerIsSignedIn();
    whenPrisonerIsAssessed(assessmentConfig);
    thenTheAssessmentIsCompleted(assessmentConfig);
  });
});
