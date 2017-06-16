import AdminPage from './pages/Admin.page';
import { givenThatTheOfficerIsSignedIn } from './tasks/officerSignsIn.task';
import { thenTheAssessmentIsCompleted, whenALowRiskPrisonerIsAssessed } from './tasks/lowRiskPrisonerAssessed.task';
import db from '../../util/db';

describe('Risk assessment (shared cell outcome)', () => {
  before(() => {
    AdminPage.visit();
    expect(AdminPage.mainHeading).to.equal('Admin');
    AdminPage.loadTestUsers();
  });

  it('Assesses a low risk prisoner', async function () {
    return new Promise((resolve) => {
      givenThatTheOfficerIsSignedIn();
      whenALowRiskPrisonerIsAssessed();
      thenTheAssessmentIsCompleted(resolve);
    });
  });
});
