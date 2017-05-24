import AdminPage from './pages/Admin.page';
import DashboardPage from './pages/Dashboard.page';
import AssessmentConfirmationPage from './pages/AssessmentConfirmation.page';
import givenThatTheOfficerIsSignedIn from './tasks/officerSignsIn.task';
import whenAViolentPrisonerIsAssessed from './tasks/violentPrisonerAssessed.task';

function thenASingleCellIsRecommended() {
  AssessmentConfirmationPage.clickConfirmAndContinue();
  expect(DashboardPage.mainHeading).to.contain('Prisoners to assess on:');
  const row = browser.element('[data-profile-row=A333333]');
  expect(row.getText()).to.equal('Ian Rate A333333 23-Mar-1988 Complete Start Single Cell');
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
