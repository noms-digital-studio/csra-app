import AdminPage from './pages/Admin.page';
import DashboardPage from './pages/Dashboard.page';
import AssessmentConfirmationPage from './pages/AssessmentConfirmation.page';
import givenThatTheOfficerIsSignedIn from './tasks/officerSignsIn.task';
import whenAPrisonerWithNoViperIsAssessed from './tasks/prisonerWithNoViperIsAssessed.task';

function thenASingleCellIsRecommended() {
  AssessmentConfirmationPage.clickConfirmAndContinue();
  expect(DashboardPage.mainHeading).to.contain('Prisoners to assess on:');
  const row = browser.element('[data-profile-row=A444444');
  expect(row.getText()).to.equal('James Neo A444444 03-Dec-1958 Complete Start Single Cell');
}

describe('CSRA assessment', () => {
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
