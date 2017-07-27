import givenThatTheOfficerIsSignedIn from './tasks/officerSignsIn.task';
import whenTheOfficerAddsThePrisonersDetails from './tasks/theOfficerAddsThePrisonersDetails.task';
import {
  whenAPrisonersHealthcareResultsAreEntered,
  thenTheHealthcareAssessmentIsComplete,
} from './helpers/complete-healthcare-assessment';


describe('Healthcare assessment', () => {

  it('Record a prisoner`s healthcare details', () => {
    givenThatTheOfficerIsSignedIn();
    whenTheOfficerAddsThePrisonersDetails();
    whenAPrisonersHealthcareResultsAreEntered();
    thenTheHealthcareAssessmentIsComplete();
  });
});
