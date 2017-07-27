import givenThatTheOfficerIsSignedIn from './tasks/officerSignsIn.task';
import whenTheOfficerAddsThePrisonersDetails from './tasks/theOfficerAddsThePrisonersDetails.task';
import {
  whenPrisonerIsAssessed as whenAVulnerablePrisonerIsAssessed,
  thenTheAssessmentIsCompleted,
} from './helpers/complete-risk-assessment';

const assessmentConfig = {
  prisoner: {
    nomisId: 'J6285NE',
    name: 'James Neo',
    dob: '3 December 1958',
  },
  viperScore: -1,
  initialRecommendation: 'No predictor data available',
  finalRecommendation: 'single cell',
  answers: {
    harmCellMate: 'no',
    vulnerability: 'yes',
    gangAffiliation: 'no',
    drugMisuse: 'no',
    prejudice: 'no',
    officersAssessment: 'no',
  },
  reasons: [
    { question_id: 'vulnerability', reason: "Officer thinks they're scared or vulnerable" },
  ],
};


describe('Risk assessment for a vulnerable prisoner (single cell outcome)', () => {
  it('Assesses a vulnerable prisoner', () => {
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
      },
    });
    whenAVulnerablePrisonerIsAssessed(assessmentConfig);
    thenTheAssessmentIsCompleted(assessmentConfig);
  });
});
