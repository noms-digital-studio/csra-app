import givenThatTheOfficerIsSignedIn from './tasks/officerSignsIn.task';
import whenTheOfficerAddsThePrisonersDetails from './tasks/theOfficerAddsThePrisonersDetails.task';
import {
  whenPrisonerIsAssessed,
  thenTheAssessmentIsCompleted,
  andICanViewTheAssessmentAgain,
} from './helpers/complete-risk-assessment';

const assessmentConfig = {
  prisoner: {
    nomisId: 'A1401AE',
    name: 'Jenifer Hallibut',
    dateOfBirth: '1 January 1970',
  },
  viperScore: 0.35,
  initialRecommendation: 'The predictor has found this person in its records',
  finalRecommendation: 'single cell',
  answers: {
    harmCellMate: 'no',
    gangAffiliation: 'no',
    drugMisuse: 'no',
    prejudice: 'no',
    officersAssessment: 'yes',
  },
  reasons: [
    { questionId: 'officers-assessment', reason: 'Officer recommends a single cell' },
  ],
};

describe('Risk assessment for a prisoner with no VIPER score (shared cell outcome)', () => {
  it('Assesses a prisoner with no viper score', () => {
    givenThatTheOfficerIsSignedIn();
    whenTheOfficerAddsThePrisonersDetails();
    whenPrisonerIsAssessed(assessmentConfig);
    thenTheAssessmentIsCompleted(assessmentConfig);
    andICanViewTheAssessmentAgain(assessmentConfig);
  });
});
