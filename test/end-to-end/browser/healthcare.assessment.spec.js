import AdminPage from './pages/Admin.page';
import DashboardPage from './pages/Dashboard.page';
import HealthcareOutcomePage from './pages/healthcare/HealthcareOutcome.page';
import AssessmentConfirmationPage from './pages/AssessmentConfirmation.page';
import HealthcareCommentsPage from './pages/healthcare/HealthcareComments.page';
import HealthcareConsentPage from './pages/healthcare/HealthcareConsent.page';
import HealthcareNursePage from './pages/healthcare/HealthcareNurse.page';
import HealthcareCompletePage from './pages/healthcare/HealthcareComplete.page';

import givenThatTheOfficerIsSignedIn from './tasks/officerSignsIn.task';

function whenAPrisonersHealthcareResultsAreEntered() {
  DashboardPage.clickHealthcareStartLinkForNomisId('J1234LO');
  expect(HealthcareOutcomePage.mainHeading).to.contain('What is the outcome of the Health Assessment?');

  HealthcareOutcomePage.clickNoAndContinue();
  expect(HealthcareCommentsPage.mainHeading).to.contain('Are there any comments made by Healthcare?');

  HealthcareCommentsPage.commentAndContinue('healthcare comment');
  expect(HealthcareConsentPage.mainHeading).to.contain('Has the prisoner given consent to share their medical information?');

  HealthcareConsentPage.clickNoAndContinue();
  expect(HealthcareNursePage.mainHeading).to.contain('Who complete the Healthcare assessment?');
  HealthcareNursePage.enterRole('Nurse');
  HealthcareNursePage.enterName('Jane Doe');
  HealthcareNursePage.enterDate('21', '07', '2017');
  HealthcareNursePage.clickContinue();
  expect(HealthcareCompletePage.mainHeading).to.equal('Healthcare assessment completed');
  expect(HealthcareCompletePage.name).to.equal('John Lowe');
  expect(HealthcareCompletePage.dob).to.equal('01-Oct-1970');
  expect(HealthcareCompletePage.nomisId).to.equal('J1234LO');
}

function thenThereHealthcareAssessmentIsComplete() {
  HealthcareCompletePage.clickContinue();
  expect(AssessmentConfirmationPage.mainHeading).to.contain('Healthcare assessment saved');
  AssessmentConfirmationPage.clickContinue();
  expect(DashboardPage.mainHeading).to.contain('Prisoners to assess on:');
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
