import givenThatTheOfficerIsSignedIn from './tasks/officerSignsIn.task';
import whenTheOfficerAddsThePrisonerDetails from './tasks/theOfficerAddsThePrisonersDetails.task';
import {
  whenPrisonerIsAssessed as whenAViolentPrisonerIsAssessed,
  thenTheAssessmentIsCompleted,
  andICanViewTheAssessmentAgain,
} from './helpers/complete-risk-assessment';

const assessmentConfig = {
  prisoner: {
    nomisId: 'A1421AE',
    name: 'James Herbert',
    dateOfBirth: '1 January 1996',
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
        forename: 'James',
        surname: 'Herbert',
        nomisId: 'A1421AE',
        dateOfBirth: '1 January 1996',
        databaseDoB: 'Jan 01 1996',
      },
    });
    whenAViolentPrisonerIsAssessed(assessmentConfig);
    thenTheAssessmentIsCompleted(assessmentConfig);
    andICanViewTheAssessmentAgain(assessmentConfig);
  });
});
