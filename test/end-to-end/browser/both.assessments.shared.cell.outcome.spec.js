import AdminPage from './pages/Admin.page';
import {
  thenTheAssessmentIsCompleted,
  whenALowRiskPrisonerIsAssessed,
} from './tasks/lowRiskPrisonerAssessed.task';
import { givenThatTheOfficerIsSignedIn } from './tasks/officerSignsIn.task';
import {
  whenHealthcareRecommendsSharedCell,
} from './tasks/prisonersHealthcareResultsAreEntered.task';
import HealthcareSummary from './pages/healthcare/HealthcareSummary.page';
import FullAssessmentOutcomePage from './pages/FullAssessmentOutcome.page';
import FullAssessmentCompletePage from './pages/FullAssessmentComplete.page';
import DashboardPage from './pages/Dashboard.page';

describe('Both assessments (Shared cell outcome)', () => {
  before(() => {
    AdminPage.visit();
    expect(AdminPage.mainHeading).to.equal('Admin');
    AdminPage.loadTestUsers();
  });

  function thenTheFullAssessmentIsCompleted() {
    HealthcareSummary.clickContinue();
    expect(
      FullAssessmentOutcomePage.waitForMainHeadingWithDataId('full-outcome'),
    ).to.equal('Risk and healthcare assessment outcome');
    expect(FullAssessmentOutcomePage.name).to.equalIgnoreCase('John Lowe');
    expect(FullAssessmentOutcomePage.dob).to.equalIgnoreCase('01-Oct-1970');
    expect(FullAssessmentOutcomePage.nomisId).to.equalIgnoreCase('J1234LO');

    expect(FullAssessmentOutcomePage.recommendOutcome).to.match(/shared cell/i);
    expect(FullAssessmentOutcomePage.riskRecommendation).to.match(/shared cell/i);

    FullAssessmentOutcomePage.clickCheckbox();
    FullAssessmentOutcomePage.clickContinue();
    expect(FullAssessmentCompletePage.mainHeading).to.equal(
      'Cell sharing risk assessment complete',
    );

    FullAssessmentCompletePage.clickContinue();
    expect(DashboardPage.mainHeading).to.contain('Assessments on:');
    const row = browser.element('[data-profile-row=J1234LO]');
    expect(row.getText()).to.equalIgnoreCase(
      'John Lowe J1234LO 01-Oct-1970 Complete Complete Shared Cell',
    );
  }

  it('Assesses a low risk prisoner', () =>
    new Promise((resolve, reject) => {
      givenThatTheOfficerIsSignedIn();
      whenALowRiskPrisonerIsAssessed();
      thenTheAssessmentIsCompleted({ sharedText: 'shared cell' }).catch(reject);
      whenHealthcareRecommendsSharedCell();
      thenTheFullAssessmentIsCompleted();

      resolve();
    }));
});
