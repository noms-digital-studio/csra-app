import givenThatTheOfficerIsSignedIn from './tasks/officerSignsIn.task';
import whenTheOfficerAddsThePrisonerDetails from './tasks/theOfficerAddsThePrisonersDetails.task';
import {
  whenPrisonerIsAssessed as whenAViolentPrisonerIsAssessed,
  thenTheAssessmentIsCompleted,
} from './helpers/complete-risk-assessment';

import upsertViperTableWith from '../utils/upsertViperTable';

const assessmentConfig = {
  prisoner: {
    nomisId: 'I9876RA',
    name: 'Ian Rate',
    dateOfBirth: '23 March 1988',
  },
  viperScore: 0.92,
  initialRecommendation: 'single cell',
  finalRecommendation: 'single cell',
  answers: {
    harmCellMate: 'no',
    vulnerability: 'no',
    gangAffiliation: 'no',
    drugMisuse: 'no',
    prejudice: 'no',
    officersAssessment: 'no',
  },
};


describe('Risk assessment for a prisoner with a high VIPER score', () => {
  before(() => upsertViperTableWith({ nomisId: 'I9876RA', viperScore: 0.92 }));

  it('Assesses a prisoner with a high viper score', () => {
    givenThatTheOfficerIsSignedIn();
    whenTheOfficerAddsThePrisonerDetails({
      prisoner: {
        forename: 'Ian',
        surname: 'Rate',
        dob: {
          day: 23,
          month: 3,
          year: 1988,
        },
        nomisId: 'I9876RA',
        dateOfBirth: '23 March 1988',
      },
    });
    whenAViolentPrisonerIsAssessed(assessmentConfig);
    thenTheAssessmentIsCompleted(assessmentConfig);
  });
});
