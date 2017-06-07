/* eslint-disable import/no-duplicates */
import AdminPage from './pages/Admin.page';
import givenThatTheOfficerIsSignedIn from './tasks/officerSignsIn.task';
import whenAPrisonersHealthcareResultsAreEntered from './tasks/prisonersHealthcareResultsAreEntered.task';
import { thenTheHealthcareAssessmentIsComplete } from './tasks/prisonersHealthcareResultsAreEntered.task';

describe('CSRA assessment', () => {
  before(() => {
    AdminPage.visit();
    expect(AdminPage.mainHeading).to.equal('Admin');
    AdminPage.loadTestUsers();
  });

  it('Record a prisoner`s healthcare details', () => {
    givenThatTheOfficerIsSignedIn();
    whenAPrisonersHealthcareResultsAreEntered(false);
    thenTheHealthcareAssessmentIsComplete();
  });
});
