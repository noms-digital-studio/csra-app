/* eslint-disable import/no-duplicates */
import AdminPage from './pages/Admin.page';
import givenThatTheOfficerIsSignedIn from './tasks/officerSignsIn.task';
import whenHealthcareRecommendsSharedCell from './tasks/prisonersHealthcareResultsAreEntered.task';
import { thenTheHealthcareAssessmentIsComplete } from './tasks/prisonersHealthcareResultsAreEntered.task';

describe('Healthcare assessment', () => {
  before(() => {
    AdminPage.visit();
    expect(AdminPage.mainHeading).to.equal('Admin');
    AdminPage.loadTestUsers();
  });

  it('Record a prisoner`s healthcare details', () => {
    givenThatTheOfficerIsSignedIn();
    whenHealthcareRecommendsSharedCell();
    thenTheHealthcareAssessmentIsComplete();
  });
});
