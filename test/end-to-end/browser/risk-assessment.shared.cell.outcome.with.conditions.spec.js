import givenThatTheOfficerIsSignedIn from './tasks/officerSignsIn.task';
import whenTheOfficerAddsThePrisonersDetails from './tasks/theOfficerAddsThePrisonersDetails.task';
import {
  whenPrisonerIsAssessed,
  thenTheAssessmentIsCompleted,
} from './helpers/complete-risk-assessment';
import upsertViperTableWith from './../utils/upsertViperTable';

const prisonerConfig = {
  prisoner: {
    forename: 'Joe',
    surname: 'Bloggs',
    dob: {
      day: 1,
      month: 10,
      year: 1970,
    },
    nomisId: 'J0000BL',
    dateOfBirth: '1 October 1970',
    databaseDoB: 'Oct 01 1970',
  },
};

const assessmentConfig = {
  prisoner: {
    nomisId: 'J0000BL',
    name: 'Joe Bloggs',
    dateOfBirth: '01 October 1970',
  },
  viperScore: 0,
  initialRecommendation: 'The predictor has found this person in its records',
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
    { questionId: 'drug-misuse', reason: 'Has indicated drug use' },
  ],
};

describe('Risk assessment (shared cell outcome with conditions)', () => {
  before(() => upsertViperTableWith({ nomisId: 'J0000BL', viperScore: 0 }));

  it('Assesses a low risk prisoner who uses drugs', () => {
    givenThatTheOfficerIsSignedIn();
    whenTheOfficerAddsThePrisonersDetails(prisonerConfig);
    whenPrisonerIsAssessed(assessmentConfig);
    thenTheAssessmentIsCompleted(assessmentConfig);
  });
});
