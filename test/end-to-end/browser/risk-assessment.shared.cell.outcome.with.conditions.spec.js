import AdminPage from './pages/Admin.page';
import {
  whenALowRiskPrisonerWhoUsesDrugsIsAssessed,
  thenTheAssessmentIsCompleted,
} from './tasks/lowRiskPrisonerAssessed.task';
import { givenThatTheOfficerIsSignedIn } from './tasks/officerSignsIn.task';

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
    thenTheAssessmentIsCompleted();
  });
});
