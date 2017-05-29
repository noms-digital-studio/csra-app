import AdminPage from './pages/Admin.page';
import DashboardPage from './pages/Dashboard.page';
import givenThatTheOfficerIsSignedIn from './tasks/officerSignsIn.task';
import whenAPrisonerWithNoViperIsAssessed from './tasks/prisonerWithNoViperIsAssessed.task';

function thenASingleCellIsRecommended() {
  expect(DashboardPage.mainHeading).to.contain('Assessments on:');
  const row = browser.element('[data-profile-row=J6285NE]');
  expect(row.getText()).to.equal('James Neo J6285NE 03-Dec-1958 Complete Start Single cell');
}

describe('Risk assessment (No Viperscore)', () => {
  before(() => {
    AdminPage.visit();
    expect(AdminPage.mainHeading).to.equal('Admin');
    AdminPage.loadTestUsers();
  });

  it('Assesses a prisoner with no viper score', () => {
    givenThatTheOfficerIsSignedIn();
    whenAPrisonerWithNoViperIsAssessed();
    thenASingleCellIsRecommended();
  });
});
