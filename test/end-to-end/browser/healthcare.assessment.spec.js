import AdminPage from './pages/Admin.page';
import { givenThatTheOfficerIsSignedIn } from './tasks/officerSignsIn.task';
import {
  whenHealthcareRecommendsSharedCell,
  thenTheHealthcareAssessmentIsComplete,
} from './tasks/prisonersHealthcareResultsAreEntered.task';

describe('Healthcare assessment', () => {
  before(() => {
    AdminPage.visit();
    expect(AdminPage.mainHeading).to.equal('Admin');
    AdminPage.loadTestUsers();
  });

  it('Record a prisoner`s healthcare details', () => new Promise((resolve, reject) => {
    givenThatTheOfficerIsSignedIn();
    whenHealthcareRecommendsSharedCell();
    thenTheHealthcareAssessmentIsComplete({ resolve, reject, sharedText: 'shared cell' });
  }));
});
