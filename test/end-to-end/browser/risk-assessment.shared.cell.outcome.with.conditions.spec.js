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
    dateOfBirth: '01 October 1970',
  },
  viperScore: 0.35,
  initialRecommendation: 'shared cell',
  finalRecommendation: 'shared cell with conditions',
  answers: {
    harmCellMate: 'no',
    vulnerability: 'no',
    gangAffiliation: 'no',
    drugMisuse: 'yes',
    prejudice: 'no',
    officersAssessment: 'no',
  },
  reasons: [
    { question_id: 'drug-misuse', reason: 'Has indicated drug use' },
  ],
};

describe('Risk assessment (shared cell outcome with conditions)', () => {
  before(() => upsertViperTableWith({ nomisId: 'J1234LO', viperScore: 0.35 }));

  it('Assesses a low risk prisoner who uses drugs', () => {
    givenThatTheOfficerIsSignedIn();
    whenTheOfficerAddsThePrisonersDetails();
    whenPrisonerIsAssessed(assessmentConfig);
    thenTheAssessmentIsCompleted(assessmentConfig);
  });
});
