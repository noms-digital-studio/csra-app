import AdminPage from './pages/Admin.page';
import { givenThatTheOfficerIsSignedIn } from './tasks/officerSignsIn.task';
import {
  whenAPrisonersHealthcareResultsAreEntered,
  thenTheHealthcareAssessmentIsComplete,
} from './helpers/complete-healthcare-assessment';


describe('Healthcare assessment', () => {
  before(() => {
    AdminPage.visit();
    expect(AdminPage.mainHeading).to.equal('Admin');
    AdminPage.loadTestUsers();
  });

  it('Record a prisoner`s healthcare details', () => {
    givenThatTheOfficerIsSignedIn();
    whenAPrisonersHealthcareResultsAreEntered();
    thenTheHealthcareAssessmentIsComplete();
  });
});
