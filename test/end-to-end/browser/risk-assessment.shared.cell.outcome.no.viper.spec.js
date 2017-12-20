import givenThatTheOfficerIsSignedIn from './tasks/officerSignsIn.task';
import whenTheOfficerAddsThePrisonersDetails from './tasks/theOfficerAddsThePrisonersDetails.task';
import {
  whenPrisonerIsAssessed as whenAPrisonerWithNoViperIsAssessed,
  thenTheAssessmentIsCompleted,
  andICanViewTheAssessmentAgain,
} from './helpers/complete-risk-assessment';

const assessmentConfig = {
  prisoner: {
    nomisId: 'A1464AE',
    name: 'Julian Vigo',
    dateOfBirth: '1 May 1974',
  },
  viperScore: null,
  initialRecommendation: 'No predictor data available',
  finalRecommendation: 'shared cell',
  answers: {
    harmCellMate: 'no',
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
        forename: 'Julian',
        surname: 'Vigo',
        nomisId: 'A1464AE',
        dateOfBirth: '1 May 1974',
        databaseDoB: 'May 01 1974',
      },
    });
    whenAPrisonerWithNoViperIsAssessed(assessmentConfig);
    thenTheAssessmentIsCompleted(assessmentConfig);
    andICanViewTheAssessmentAgain(assessmentConfig);
  });
});
