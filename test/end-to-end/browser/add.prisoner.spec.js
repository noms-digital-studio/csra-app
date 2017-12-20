import DashboardPage from './pages/Dashboard.page';
import givenThatTheOfficerIsSignedIn from './tasks/officerSignsIn.task';
import whenTheOfficerAddsAPrisonerToAssess from './tasks/theOfficerAddsThePrisonersDetails.task';


function thenThePrisonerIsAvailableToAssess() {
  expect(DashboardPage.mainHeading).to.contain('All assessments');
  const row = browser.element('[data-element-id="profile-row-A1401AE"]');
  expect(row.getText()).to.equal('Jilly Hall A1401AE 1 January 1970 Start Start');
}

describe('add prisoner', () => {
  before(() => {
    browser.url('/');
  });

  it('adds a new prisoner to the system', () => {
    givenThatTheOfficerIsSignedIn();
    whenTheOfficerAddsAPrisonerToAssess();
    thenThePrisonerIsAvailableToAssess();
  });
});
