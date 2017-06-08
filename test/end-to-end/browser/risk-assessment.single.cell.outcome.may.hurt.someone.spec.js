/* eslint-disable import/no-duplicates */
import AdminPage from './pages/Admin.page';
import givenThatTheOfficerIsSignedIn from './tasks/officerSignsIn.task';
import whenAPrisonerWhoMayHurtSomeoneIsAssessed from './tasks/prisonerWhoMayHurtSomeoneIsAssessed.task';
import { thenASingleCellIsRecommended } from './tasks/prisonerWhoMayHurtSomeoneIsAssessed.task';

describe('Risk assessment for a prisoner who may hurt someone (single cell outcome)', () => {
  before(() => {
    AdminPage.visit();
    expect(AdminPage.mainHeading).to.equal('Admin');
    AdminPage.loadTestUsers();
  });

  it('Assesses a a prisoner who may hurt someone', () => {
    givenThatTheOfficerIsSignedIn();
    whenAPrisonerWhoMayHurtSomeoneIsAssessed();
    thenASingleCellIsRecommended();
  });
});
