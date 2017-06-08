/* eslint-disable import/no-duplicates */
import AdminPage from './pages/Admin.page';
import { whenALowRiskPrisonerWhoUsesDrugsIsAssessed } from './tasks/lowRiskPrisonerAssessed.task';
import givenThatTheOfficerIsSignedIn from './tasks/officerSignsIn.task';
import { thenASharedCellWithConditionsIsRecommended } from './tasks/lowRiskPrisonerAssessed.task';

describe('Risk assessment (shared cell outcome with conditions)', () => {
  before(() => {
    AdminPage.visit();
    expect(AdminPage.mainHeading).to.equal('Admin');
    AdminPage.loadTestUsers();
  });

  afterEach(() => {
    browser.reload();
  });

  it('Assesses a low risk prisoner who uses drugs', () => {
    givenThatTheOfficerIsSignedIn();
    whenALowRiskPrisonerWhoUsesDrugsIsAssessed();
    thenASharedCellWithConditionsIsRecommended();
  });
});
