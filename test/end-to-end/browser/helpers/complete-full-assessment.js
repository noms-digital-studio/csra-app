import DashboardPage from '../pages/Dashboard.page';
import HealthcareSummary from '../pages/healthcare/HealthcareSummary.page';
import FullAssessmentOutcomePage from '../pages/FullAssessmentOutcome.page';
import FullAssessmentCompletePage from '../pages/FullAssessmentComplete.page';
import { checkThatTheOutcomeDataWasWrittenToDatabaseSync } from '../../utils/dbAssertions';

const caseInSensitive = text => new RegExp(text, 'i');

const defaultFullAssessmentConfig = {
  prisoner: {
    nomisId: 'J1234LO',
    name: 'John Lowe',
    dateOfBirth: '01 October 1970',
  },
  finalOutcome: 'shared cell',
};

function thenTheFullAssessmentIsCompleted(config = defaultFullAssessmentConfig) {
  HealthcareSummary.clickContinue();

  FullAssessmentOutcomePage.waitForMainHeadingWithDataId('full-outcome');

  expect(FullAssessmentOutcomePage.prisonerName).to.equalIgnoreCase(config.prisoner.name);
  expect(FullAssessmentOutcomePage.prisonerDob).to.equalIgnoreCase(config.prisoner.dateOfBirth);
  expect(FullAssessmentOutcomePage.prisonerNomisId).to.equalIgnoreCase(config.prisoner.nomisId);

  expect(FullAssessmentOutcomePage.recommendOutcome).to.match(caseInSensitive(config.finalOutcome));

  FullAssessmentOutcomePage.confirmAndContinue();

  expect(
    FullAssessmentCompletePage.waitForMainHeadingWithDataId('full-assessment-complete'),
  ).to.equal('Cell sharing risk assessment complete');


  FullAssessmentCompletePage.clickContinue();

  expect(DashboardPage.mainHeading).to.contain('Assessments on:');

  browser.waitForVisible(`[data-element-id="profile-row-${config.prisoner.nomisId}"]`, 5000);
  const row = browser.element(`[data-element-id="profile-row-${config.prisoner.nomisId}"]`);
  const assessmentId = row.getAttribute('data-assessment-id');

  expect(row.getText()).to.equalIgnoreCase(`${config.prisoner.name} ${config.prisoner.nomisId} ${config.prisoner.dateOfBirth} Complete Complete ${config.finalOutcome} View`);

  checkThatTheOutcomeDataWasWrittenToDatabaseSync({
    id: assessmentId,
    outcome: config.finalOutcome,
  });
}

const viewFullOutcomeForPrisoner = (config = defaultFullAssessmentConfig) => {
  DashboardPage.viewFullOutcomeFor(config.prisoner.nomisId);

  expect(
    FullAssessmentOutcomePage.waitForMainHeadingWithDataId('full-outcome'),
  ).to.equal('Risk and healthcare assessment outcome');

  expect(FullAssessmentOutcomePage.prisonerName).to.equalIgnoreCase(config.prisoner.name);
  expect(FullAssessmentOutcomePage.prisonerDob).to.equalIgnoreCase(config.prisoner.dateOfBirth);
  expect(FullAssessmentOutcomePage.prisonerNomisId).to.equalIgnoreCase(config.prisoner.nomisId);

  expect(FullAssessmentOutcomePage.recommendOutcome).to.match(caseInSensitive(config.finalOutcome));

  FullAssessmentOutcomePage.clickContinue();
  expect(DashboardPage.mainHeading).to.contain('Assessments on:');

  const row = browser.element(`[data-element-id="profile-row-${config.prisoner.nomisId}"]`);

  expect(row.getText()).to.equalIgnoreCase(`${config.prisoner.name} ${config.prisoner.nomisId} ${config.prisoner.dateOfBirth} Complete Complete ${config.finalOutcome} View`);
};

export {
  thenTheFullAssessmentIsCompleted,
  viewFullOutcomeForPrisoner,
};
