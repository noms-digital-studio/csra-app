import givenThatTheOfficerIsSignedIn from './tasks/officerSignsIn.task';
import whenTheOfficerAddsThePrisonerDetails from './tasks/theOfficerAddsThePrisonersDetails.task';
import {
  whenPrisonerIsAssessed as whenAViolentPrisonerIsAssessed,
  thenTheAssessmentIsCompleted,
  andICanViewTheAssessmentAgain,
} from './helpers/complete-risk-assessment';

const assessmentConfig = {
  prisoner: {
    nomisId: 'I9876RA',
    name: 'Ian Rate',
    dateOfBirth: '23 March 1988',
  },
  viperScore: 0.92,
  initialRecommendation: 'The predictor has found this person in its records',
  finalRecommendation: 'single cell',
  answers: {
    harmCellMate: 'no',
    gangAffiliation: 'no',
    drugMisuse: 'no',
    prejudice: 'no',
    officersAssessment: 'no',
  },
  reasons: [
    { questionId: 'risk-of-violence', reason: 'The cell violence predictor recommends a single cell' },
  ],
};


describe('Risk assessment for a prisoner with a high VIPER score', () => {
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
        databaseDoB: 'Mar 23 1988',
      },
    });
    whenAViolentPrisonerIsAssessed(assessmentConfig);
    thenTheAssessmentIsCompleted(assessmentConfig);
    andICanViewTheAssessmentAgain(assessmentConfig);
  });
});
