import AdminPage from './pages/Admin.page';
import { givenThatTheOfficerIsSignedIn } from './tasks/officerSignsIn.task';
import { thenTheAssessmentIsCompleted, whenAVulnerablePrisonerIsAssessed } from './tasks/vulnerablePrisonerAssessed.task';

describe('Risk assessment for a vulnerable prisoner (single cell outcome)', () => {
  before(() => {
    AdminPage.visit();
    expect(AdminPage.mainHeading).to.equal('Admin');
    AdminPage.loadTestUsers();
  });

  it('Assesses a vulnerable prisoner', () => new Promise((resolve, reject) => {
    givenThatTheOfficerIsSignedIn();
    whenAVulnerablePrisonerIsAssessed();
    thenTheAssessmentIsCompleted({ resolve, reject });
  }));
});
