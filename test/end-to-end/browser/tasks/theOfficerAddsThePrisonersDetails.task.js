import AddPrisonerPage from '../pages/add-prisoner/AddPrisoner.page';
import PrisonerAddedPage from '../pages/add-prisoner/PrisonerAdded.page';
import DashboardPage from '../pages/Dashboard.page';
import { parseDate } from '../../../../client/javascript/utils';


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
  const date = new Date(
    config.prisoner.dob.year,
    config.prisoner.dob.month - 1,
    config.prisoner.dob.day,
  );
  DashboardPage.clickAddPrisoner();

  expect(AddPrisonerPage.mainHeading).to.equal('Add Prisoner');

  AddPrisonerPage.enterName(config.prisoner.forename, config.prisoner.surname);
  AddPrisonerPage.enterDoB(config.prisoner.dob.day, config.prisoner.dob.month, config.prisoner.dob.year);
  AddPrisonerPage.enterNomisId(config.prisoner.nomisId);
  AddPrisonerPage.clickContinue();

  expect(PrisonerAddedPage.mainHeading).to.equal('Prisoner Added');
  expect(PrisonerAddedPage.name).to.equal(`${config.prisoner.forename} ${config.prisoner.surname}`);
  expect(PrisonerAddedPage.dob).to.equal(parseDate(date));
  expect(PrisonerAddedPage.nomisId).to.equal(config.prisoner.nomisId);

  PrisonerAddedPage.clickContinue();
  DashboardPage.waitForMainHeadingWithDataId('dashboard');
}

export default whenTheOfficerAddsThePrisonersDetails;
