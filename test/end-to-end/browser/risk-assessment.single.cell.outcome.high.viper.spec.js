import AdminPage from './pages/Admin.page';
import DashboardPage from './pages/Dashboard.page';
import givenThatTheOfficerIsSignedIn from './tasks/officerSignsIn.task';
import whenAViolentPrisonerIsAssessed from './tasks/violentPrisonerAssessed.task';

function thenASingleCellIsRecommended() {
  expect(DashboardPage.mainHeading).to.contain('Assessments on:');
  const row = browser.element('[data-profile-row=I9876RA]');
  expect(row.getText()).to.equal('Ian Rate I9876RA 23-Mar-1988 Complete Start Single cell');
}

describe('Risk assessment (High VIPER score)', () => {
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
