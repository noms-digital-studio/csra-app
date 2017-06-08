/* eslint-disable import/no-duplicates */
import AdminPage from './pages/Admin.page';
import whenALowRiskPrisonerIsAssessed from './tasks/lowRiskPrisonerAssessed.task';
import givenThatTheOfficerIsSignedIn from './tasks/officerSignsIn.task';
import { thenASharedCellIsRecommended } from './tasks/lowRiskPrisonerAssessed.task';

describe('Risk assessment (shared cell outcome)', () => {
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
