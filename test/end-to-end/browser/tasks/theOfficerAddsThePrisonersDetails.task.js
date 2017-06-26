import AddPrisonerPage from '../pages/add-prisoner/AddPrisoner.page';
import PrisonerAddedPage from '../pages/add-prisoner/PrisonerAdded.page';
import DashboardPage from '../pages/Dashboard.page';

function whenTheOfficerAddsThePrisonersDetails(nomisId) {
  DashboardPage.clickAddPrisoner();
  expect(AddPrisonerPage.mainHeading).to.equal('Add Prisoner');
  AddPrisonerPage.enterName('John', 'Lowe');
  AddPrisonerPage.enterDoB('01', '10', '1970');
  AddPrisonerPage.enterNomisId(nomisId || 'A12345');
  AddPrisonerPage.clickAddPrisonerButton();
  expect(PrisonerAddedPage.mainHeading).to.equal('Prisoner Added');
  expect(PrisonerAddedPage.name).to.equal('John Lowe');
  expect(PrisonerAddedPage.dob).to.equal('01-10-1970');
  expect(PrisonerAddedPage.nomisId).to.equal(nomisId || 'A12345');
  PrisonerAddedPage.clickConfirm();
}

export default whenTheOfficerAddsThePrisonersDetails;
