import AddPrisonerPage from '../pages/add-prisoner/AddPrisoner.page';
import PrisonerAddedPage from '../pages/add-prisoner/PrisonerAdded.page';
import DashboardPage from '../pages/Dashboard.page';
import { checkThatPrisonerAssessmentDataWasWrittenToDatabase } from '../../utils/dbAssertions';

const defaultConfig = {
  smokeTest: false,
  prisoner: {
    forename: 'John',
    surname: 'Lowe',
    dob: {
      day: 1,
      month: 10,
      year: 1970,
    },
    nomisId: 'J1234LO',
    dateOfBirth: '1 October 1970',
    databaseDoB: 'Oct 01 1970',
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
  expect(PrisonerAddedPage.dateOfBirth).to.equal(config.prisoner.dateOfBirth);
  expect(PrisonerAddedPage.nomisId).to.equal(config.prisoner.nomisId);

  PrisonerAddedPage.clickContinue();
  DashboardPage.waitForMainHeadingWithDataId('dashboard');

  if (!config.smokeTest) {
    const row = browser.element(`[data-element-id="profile-row-${config.prisoner.nomisId}"]`);
    const assessmentId = row.getAttribute('data-assessment-id');
    checkThatPrisonerAssessmentDataWasWrittenToDatabase({
      id: assessmentId,
      nomisId: config.prisoner.nomisId,
      forename: config.prisoner.forename,
      surname: config.prisoner.surname,
      dateOfBirth: config.prisoner.databaseDoB,
    });
  }
}

export default whenTheOfficerAddsThePrisonersDetails;
