import { LoginPage, BeforeYouStartPage, Dashboard, AddPrisonerPage, PrisonerAddedPage } from './pages/addPrisoner';

const loginPage = new LoginPage();
const beforeYouStartPage = new BeforeYouStartPage();
const dashboardPage = new Dashboard();
const addPrisonerPage = new AddPrisonerPage();
const prisonerAddedPage = new PrisonerAddedPage();

function givenThatTheOfficerIsSignedIn() {
  expect(loginPage.mainHeading).to.equal('Your full name');
  loginPage.enterUsername('officer1');
  loginPage.submitPage();
  expect(beforeYouStartPage.headerUsername).to.equal('officer1');
  expect(beforeYouStartPage.mainHeading).to.equal('Cell sharing risk assessment');
  beforeYouStartPage.clickContinue();
  expect(dashboardPage.mainHeading).to.contain('Prisoners to assess on:');
}

function whenTheOfficerAddsThePrisonersDetails() {
  dashboardPage.clickAddPrisoner();
  expect(addPrisonerPage.mainHeading).to.equal('Add Prisoner');
  addPrisonerPage.enterName('Henry', 'Young');
  addPrisonerPage.enterDoB('23', '5', '1974');
  addPrisonerPage.enterNomisId('A12345');
  addPrisonerPage.clickAddPrisonerButton();
  expect(prisonerAddedPage.mainHeading).to.equal('Prisoner Added');
  expect(prisonerAddedPage.name).to.equal('Henry Young');
  expect(prisonerAddedPage.dob).to.equal('23-5-1974');
  expect(prisonerAddedPage.nomisId).to.equal('A12345');
  prisonerAddedPage.clickConfirm();
}

function thenThePrisonerIsAvailableToAssess() {
  expect(dashboardPage.mainHeading).to.contain('Prisoners to assess on:');
  const row = browser.element('[data-profile-row]:nth-child(1)');
  expect(row.getText()).to.equal('Henry Young A12345 23-5-1974 Start Start');
}

describe('add prisoner', () => {
  before(() => {
    browser.url('/');
  });

  it('adds prisoner (page object version)', () => {
    givenThatTheOfficerIsSignedIn();
    whenTheOfficerAddsThePrisonersDetails();
    thenThePrisonerIsAvailableToAssess();
  });
});
