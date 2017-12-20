import givenThatTheOfficerIsSignedIn from './tasks/officerSignsIn.task';
import whenTheOfficerAddsThePrisonersDetails from './tasks/theOfficerAddsThePrisonersDetails.task';

import {
  whenPrisonerIsAssessed as whenALowRiskPrisonerIsAssessed,
  thenTheAssessmentIsCompleted as thenTheRiskAssessmentIsCompleted,
} from './helpers/complete-risk-assessment';

import {
  whenAPrisonersHealthcareResultsAreEntered as whenHealthcareRecommendsSharedCell,
} from './helpers/complete-healthcare-assessment';

import {
  thenTheFullAssessmentIsCompleted,
  viewFullOutcomeForPrisoner as andICanViewTheirAssessmentOutcomeAgain,
} from './helpers/complete-full-assessment';

const prisoner = {
  nomisId: 'A1401AE',
  name: 'Jilly Hall',
  dateOfBirth: '1 January 1970',
};


const healthcareAssessmentConfig = {
  prisoner,
  answers: {
    singleCellRecommendation: 'yes',
  },
  recommendation: 'single cell',
  viperScore: 0.35,
};

const fullAssessmentCompleteConfig = {
  prisoner,
  finalOutcome: 'single cell',
};

describe('Both assessments (Single cell outcome)', () => {
  it('Assesses a low risk prisoner', () => {
    browser.url('/');

    givenThatTheOfficerIsSignedIn();
    whenTheOfficerAddsThePrisonersDetails();
    whenALowRiskPrisonerIsAssessed();
    thenTheRiskAssessmentIsCompleted();
    whenHealthcareRecommendsSharedCell(healthcareAssessmentConfig);
    thenTheFullAssessmentIsCompleted(fullAssessmentCompleteConfig);
    andICanViewTheirAssessmentOutcomeAgain(fullAssessmentCompleteConfig);
  });
});
