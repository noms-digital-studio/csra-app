import AdminPage from './pages/Admin.page';
import DashboardPage from './pages/Dashboard.page';
import CsraAssessmentConfirmationPage from './pages/csra/CsraAssessmentConfirmation.page';
import givenThatTheOfficerIsSignedIn from './tasks/officerSignsIn.task';
import whenAViolentPrisonerIsAssessed from './tasks/violentPrisonerAssessed.task';

function thenASingleCellIsRecommended() {
  CsraAssessmentConfirmationPage.clickConfirmAndContinue();
  expect(DashboardPage.mainHeading).to.contain('Assessments on:');
  const row = browser.element('[data-profile-row=I9876RA]');
  expect(row.getText()).to.equal('Ian Rate I9876RA 23-Mar-1988 Complete Start Single Cell');
}

describe('CSRA assessment', () => {
  before(() => {
    AdminPage.visit();
    expect(AdminPage.mainHeading).to.equal('Admin');
    AdminPage.loadTestUsers();
  });

  it('Assesses a violent prisoner', () => {
    givenThatTheOfficerIsSignedIn();
    whenAViolentPrisonerIsAssessed();
    thenASingleCellIsRecommended();
  });
});
