import givenThatTheOfficerIsSignedIn from './tasks/officerSignsIn.task';
import whenTheOfficerAddsThePrisonersDetails from './tasks/theOfficerAddsThePrisonersDetails.task';
import {
  whenPrisonerIsAssessed as whenALowRiskPrisonerIsAssessed,
  thenTheAssessmentIsCompleted,
  andICanViewTheAssessmentAgain,
} from './helpers/complete-risk-assessment';

describe('Risk assessment (shared cell outcome)', () => {
  it('Assesses a low risk prisoner', () => {
    givenThatTheOfficerIsSignedIn();
    whenTheOfficerAddsThePrisonersDetails();
    whenALowRiskPrisonerIsAssessed();
    thenTheAssessmentIsCompleted();
    andICanViewTheAssessmentAgain();
  });
});
