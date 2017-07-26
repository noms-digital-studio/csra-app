import givenThatTheOfficerIsSignedIn from './tasks/officerSignsIn.task';
import whenTheOfficerAddsThePrisonersDetails from './tasks/theOfficerAddsThePrisonersDetails.task';
import {
  whenPrisonerIsAssessed,
  thenTheAssessmentIsCompleted,
} from './helpers/complete-risk-assessment';
import upsertViperTableWith from './../utils/upsertViperTable';

const assessmentConfig = {
  prisoner: {
    nomisId: 'J1234LO',
    name: 'John Lowe',
    dateOfBirth: '1 October 1970',
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
  before(() => upsertViperTableWith({ nomisId: 'J1234LO', viperScore: 0.35 }));

  it('Assesses a prisoner with no viper score', () => {
    givenThatTheOfficerIsSignedIn();
    whenTheOfficerAddsThePrisonersDetails();
    whenPrisonerIsAssessed(assessmentConfig);
    thenTheAssessmentIsCompleted(assessmentConfig);
  });
});
