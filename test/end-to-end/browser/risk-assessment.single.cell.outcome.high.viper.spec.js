import AdminPage from './pages/Admin.page';
import DashboardPage from './pages/Dashboard.page';
import { givenThatTheOfficerIsSignedIn } from './tasks/officerSignsIn.task';
import whenAViolentPrisonerIsAssessed from './tasks/violentPrisonerAssessed.task';

function thenTheAssessmentIsCompleted() {
  expect(DashboardPage.waitForMainHeadingWithDataId('dashboard')).to.contain('Assessments on:');
  const row = browser.element('[data-element-id="profile-row-I9876RA"]');
  expect(row.getText()).to.equal('Ian Rate I9876RA 23-03-1988 Complete Start');
}

describe('Risk assessment for a prisoner with a high VIPER score', () => {
  before(() => {
    AdminPage.visit();
    expect(AdminPage.mainHeading).to.equal('Admin');
    AdminPage.loadTestUsers();
  });

  it('Assesses a prisoner with a high viper score', () => {
    givenThatTheOfficerIsSignedIn();
    whenAViolentPrisonerIsAssessed();
    thenTheAssessmentIsCompleted();
  });
});
