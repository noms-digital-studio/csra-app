import AdminPage from './pages/Admin.page';
import DashboardPage from './pages/Dashboard.page';
import CsraAssessmentConfirmationPage from './pages/csra/CsraAssessmentConfirmation.page';
import whenALowRiskPrisonerIsAssessed from './tasks/lowRiskPrisonerAssessed.task';
import givenThatTheOfficerIsSignedIn from './tasks/officerSignsIn.task';

function thenASharedCellIsRecommended() {
  CsraAssessmentConfirmationPage.clickConfirmAndContinue();
  expect(DashboardPage.mainHeading).to.contain('Prisoners to assess on:');
  const row = browser.element('[data-profile-row=J1234LO]');
  expect(row.getText()).to.equal('John Lowe J1234LO 01-Oct-1970 Complete Start Shared Cell');
}

describe('CSRA assessment', () => {
  before(() => {
    AdminPage.visit();
    expect(AdminPage.mainHeading).to.equal('Admin');
    AdminPage.loadTestUsers();
  });

  it('Assesses a low risk prisoner', () => {
    givenThatTheOfficerIsSignedIn();
    whenALowRiskPrisonerIsAssessed();
    thenASharedCellIsRecommended();
  });
});
