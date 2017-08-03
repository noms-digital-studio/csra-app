import AddPrisonerPage from '../pages/add-prisoner/AddPrisoner.page';
import PrisonerAddedPage from '../pages/add-prisoner/PrisonerAdded.page';
import DashboardPage from '../pages/Dashboard.page';

const defaultConfig = {
  prisoner: {
    forename: 'John',
    surname: 'Lowe',
    dob: {
      day: 1,
      month: 10,
      year: 1970,
    },
    nomisId: 'J1234LO',
  },
};

function whenTheOfficerAddsThePrisonersDetails(config = defaultConfig) {
  DashboardPage.clickAddPrisoner();

  expect(AddPrisonerPage.mainHeading).to.equal('Add Prisoner');

  AddPrisonerPage.enterName(config.prisoner.forename, config.prisoner.surname);
  AddPrisonerPage.enterDoB(
    config.prisoner.dob.day,
    config.prisoner.dob.month,
    config.prisoner.dob.year,
  );
  AddPrisonerPage.enterNomisId(config.prisoner.nomisId);
  AddPrisonerPage.clickContinue();

  expect(PrisonerAddedPage.mainHeading).to.equal('Prisoner Added');
  expect(PrisonerAddedPage.name).to.equal(`${config.prisoner.forename} ${config.prisoner.surname}`);
  expect(PrisonerAddedPage.dateOfBirth).to.equal('1 October 1970');
  expect(PrisonerAddedPage.nomisId).to.equal(config.prisoner.nomisId);

  PrisonerAddedPage.clickContinue();
  DashboardPage.waitForMainHeadingWithDataId('dashboard');
}

export default whenTheOfficerAddsThePrisonersDetails;
