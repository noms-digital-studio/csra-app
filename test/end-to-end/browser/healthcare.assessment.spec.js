import AdminPage from './pages/Admin.page';
import DashboardPage from './pages/Dashboard.page';
import HealthcareOutcomePage from './pages/healthcare/HealthcareOutcome.page';
import HealthcareAssessmentSave from './pages/healthcare/HealthcareAssessmentSave.page';
import HealthcareCommentsPage from './pages/healthcare/HealthcareComments.page';
import HealthcareConsentPage from './pages/healthcare/HealthcareConsent.page';
import HealthcareNursePage from './pages/healthcare/HealthcareNurse.page';
import HealthcareCompletePage from './pages/healthcare/HealthcareComplete.page';

import givenThatTheOfficerIsSignedIn from './tasks/officerSignsIn.task';

function whenAPrisonersHealthcareResultsAreEntered() {
  DashboardPage.clickHealthcareStartLinkForNomisId('J1234LO');
  expect(HealthcareOutcomePage.mainHeading).to.contain('Does healthcare recommend a single cell?');

  HealthcareOutcomePage.clickNoAndContinue();
  expect(HealthcareCommentsPage.mainHeading).to.contain('Enter all the comments on the healthcare form');

  HealthcareCommentsPage.commentAndContinue('a healthcare comment');
  expect(HealthcareConsentPage.mainHeading).to.contain('Have they given consent to share their medical information?');

  HealthcareConsentPage.clickNoAndContinue();
  expect(HealthcareNursePage.mainHeading).to.contain('Who complete the healthcare assessment?');
  HealthcareNursePage.enterRole('Nurse');
  HealthcareNursePage.enterName('Jane Doe');
  HealthcareNursePage.enterDate('21', '07', '2017');
  HealthcareNursePage.clickContinue();
  expect(HealthcareCompletePage.mainHeading).to.equal('Healthcare summary');
  expect(HealthcareCompletePage.name).to.equal('John Lowe');
  expect(HealthcareCompletePage.dob).to.equal('01-Oct-1970');
  expect(HealthcareCompletePage.nomisId).to.equal('J1234LO');
  expect(HealthcareCompletePage.assessor).to.equal('Jane Doe');
  expect(HealthcareCompletePage.role).to.equal('Nurse');
  expect(HealthcareCompletePage.date).to.equal('21-07-2017');
  expect(HealthcareCompletePage.outcome).to.equal('Shared Cell');
  expect(HealthcareCompletePage.comments).to.equal('A Healthcare Comment');
  expect(HealthcareCompletePage.consent).to.equal('No');

  HealthcareCompletePage.clickChange();
  HealthcareConsentPage.clickYesAndContinue();
  expect(HealthcareCompletePage.consent).to.equal('Yes');
}

function thenThereHealthcareAssessmentIsComplete() {
  HealthcareCompletePage.clickContinue();
  expect(DashboardPage.mainHeading).to.contain('Assessments on:');
  const row = browser.element('[data-profile-row=J1234LO]');
  expect(row.getText()).to.equal('John Lowe J1234LO 01-Oct-1970 Start Complete');
}


describe('CSRA assessment', () => {
  before(() => {
    AdminPage.visit();
    expect(AdminPage.mainHeading).to.equal('Admin');
    AdminPage.loadTestUsers();
  });

  it('Record a prisoner`s healthcare details', () => {
    givenThatTheOfficerIsSignedIn();
    whenAPrisonersHealthcareResultsAreEntered();
    thenThereHealthcareAssessmentIsComplete();
  });
});
