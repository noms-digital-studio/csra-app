import AdminPage from './pages/Admin.page';
import DashboardPage from './pages/Dashboard.page';
import { givenThatTheOfficerIsSignedIn } from './tasks/officerSignsIn.task';
import whenAPrisonerWithNoViperIsAssessed from './tasks/prisonerWithNoViperIsAssessed.task';

function thenTheAssessmentIsCompleted() {
  expect(DashboardPage.waitForMainHeadingWithDataId('dashboard')).to.contain('Assessments on:');
  const row = browser.element('[data-element-id="profile-row-J6285NE"]');
  expect(row.getText()).to.equal('James Neo J6285NE 3 December 1958 Complete Start');
}

describe('Risk assessment for a prisoner with no VIPER score (shared cell outcome)', () => {
  before(() => {
    AdminPage.visit();
    expect(AdminPage.mainHeading).to.equal('Admin');
    AdminPage.loadTestUsers();
  });

  it('Assesses a prisoner with no viper score', () => {
    givenThatTheOfficerIsSignedIn();
    whenAPrisonerWithNoViperIsAssessed();
    thenTheAssessmentIsCompleted();
  });
});
