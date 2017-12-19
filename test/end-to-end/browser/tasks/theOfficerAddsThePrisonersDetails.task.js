import AddPrisonerPage from '../pages/add-prisoner/AddPrisoner.page';
import DashboardPage from '../pages/Dashboard.page';
import { checkThatPrisonerAssessmentDataWasWrittenToDatabase } from '../../utils/dbAssertions';

const defaultConfig = {
  smokeTest: false,
  prisoner: {
    forename: 'Jilly',
    surname: 'Hall',
    nomisId: 'A1401AE',
    dateOfBirth: '1 January 1970',
    databaseDoB: 'Jan 01 1970',
  },
};

function whenTheOfficerAddsThePrisonersDetails(config = defaultConfig) {
  DashboardPage.clickAddPrisoner();

  expect(AddPrisonerPage.mainHeading).to.equal('Search for a prisoner');

  AddPrisonerPage.search(config.prisoner.forename.toLowerCase());

  AddPrisonerPage.clickContinue();

  browser.waitForVisible('[data-element-id="search-results"]', 10000);
  const prisonerRow = browser.element(`[data-element-id="${config.prisoner.nomisId}"]`);
  const prisonerRowText = prisonerRow.getText();

  expect(prisonerRowText).to.contain(config.prisoner.forename);
  expect(prisonerRowText).to.contain(config.prisoner.surname);
  expect(prisonerRowText).to.contain(config.prisoner.nomisId);
  expect(prisonerRowText).to.contain(config.prisoner.dateOfBirth);

  prisonerRow.element('button').click();

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
