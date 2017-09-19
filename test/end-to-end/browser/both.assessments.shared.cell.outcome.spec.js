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

describe('Both assessments (Shared cell outcome)', () => {
  it('Assesses a low risk prisoner', () => {
    browser.url('/');

    givenThatTheOfficerIsSignedIn();
    whenTheOfficerAddsThePrisonersDetails();
    whenALowRiskPrisonerIsAssessed();
    thenTheRiskAssessmentIsCompleted();
    whenHealthcareRecommendsSharedCell();
    thenTheFullAssessmentIsCompleted();

    andICanViewTheirAssessmentOutcomeAgain();
  });
});
