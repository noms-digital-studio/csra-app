import DashboardPage from './pages/Dashboard.page';
import givenThatTheOfficerIsSignedIn from './tasks/officerSignsIn.task';
import whenTheOfficerAddsThePrisonersDetails from './tasks/theOfficerAddsThePrisonersDetails.task';


function thenThePrisonerIsAvailableToAssess() {
  expect(DashboardPage.mainHeading).to.contain('All assessments');
  const row = browser.element('[data-element-id="profile-row-J1234LO"]');
  expect(row.getText()).to.equal('John Lowe J1234LO 01 October 1970 Start Start');
}

describe('add prisoner', () => {
  before(() => {
    browser.url('/');
  });

  it('adds a new prisoner to the system', () => {
    givenThatTheOfficerIsSignedIn();
    whenTheOfficerAddsThePrisonersDetails();
    thenThePrisonerIsAvailableToAssess();
  });
});
