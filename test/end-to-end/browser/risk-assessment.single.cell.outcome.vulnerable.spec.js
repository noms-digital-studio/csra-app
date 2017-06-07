/* eslint-disable import/no-duplicates */
import AdminPage from './pages/Admin.page';
import givenThatTheOfficerIsSignedIn from './tasks/officerSignsIn.task';
import whenAVulnerableRiskPrisonerIsAssessed from './tasks/vulnerablePrisonerAssessed.task';
import { thenASingleCellIsRecommended } from './tasks/vulnerablePrisonerAssessed.task';

describe('Risk assessment (High viper score)', () => {
  before(() => {
    AdminPage.visit();
    expect(AdminPage.mainHeading).to.equal('Admin');
    AdminPage.loadTestUsers();
  });

  it('Assesses a violent prisoner', () => {
    givenThatTheOfficerIsSignedIn();
    whenAVulnerableRiskPrisonerIsAssessed();
    thenASingleCellIsRecommended();
  });
});
