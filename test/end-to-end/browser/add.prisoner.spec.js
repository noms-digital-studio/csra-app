import AddPrisonerPage from './pages/AddPrisoner.page';
import PrisonerAddedPage from './pages/PrisonerAdded.page';
import DashboardPage from './pages/Dashboard.page';
import givenThatTheOfficerIsSignedIn from './tasks/officerSignsIn.task';

function whenTheOfficerAddsThePrisonersDetails() {
  DashboardPage.clickAddPrisoner();
  expect(AddPrisonerPage.mainHeading).to.equal('Add Prisoner');
  AddPrisonerPage.enterName('Henry', 'Young');
  AddPrisonerPage.enterDoB('23', '5', '1974');
  AddPrisonerPage.enterNomisId('A12345');
  AddPrisonerPage.clickAddPrisonerButton();
  expect(PrisonerAddedPage.mainHeading).to.equal('Prisoner Added');
  expect(PrisonerAddedPage.name).to.equal('Henry Young');
  expect(PrisonerAddedPage.dob).to.equal('23-5-1974');
  expect(PrisonerAddedPage.nomisId).to.equal('A12345');
  PrisonerAddedPage.clickConfirm();
}

function thenThePrisonerIsAvailableToAssess() {
  expect(DashboardPage.mainHeading).to.contain('Prisoners to assess on:');
  const row = browser.element('[data-profile-row=A12345]');
  expect(row.getText()).to.equal('Henry Young A12345 23-5-1974 Start Start');
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
