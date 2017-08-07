import givenThatTheOfficerIsSignedIn from './tasks/officerSignsIn.task';
import whenTheOfficerAddsThePrisonersDetails from './tasks/theOfficerAddsThePrisonersDetails.task';
import {
  whenPrisonerIsAssessed as whenAPrisonerWithNoViperIsAssessed,
  thenTheAssessmentIsCompleted,
} from './helpers/complete-risk-assessment';

const assessmentConfig = {
  prisoner: {
    nomisId: 'J6285NE',
    name: 'James Neo',
    dateOfBirth: '03 December 1958',
  },
  viperScore: null,
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
  it('Assesses a prisoner with no viper score', () => {
    givenThatTheOfficerIsSignedIn();
    whenTheOfficerAddsThePrisonersDetails({
      prisoner: {
        forename: 'James',
        surname: 'Neo',
        dob: {
          day: 3,
          month: 12,
          year: 1958,
        },
        nomisId: 'J6285NE',
        dateOfBirth: '3 December 1958',
        dataBaseDoB: 'Dec 03 1958',
      },
    });
    whenAPrisonerWithNoViperIsAssessed(assessmentConfig);
    thenTheAssessmentIsCompleted(assessmentConfig);
  });
});
