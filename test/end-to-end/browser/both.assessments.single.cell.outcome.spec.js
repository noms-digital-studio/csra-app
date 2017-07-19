import AdminPage from './pages/Admin.page';
import { givenThatTheOfficerIsSignedIn } from './tasks/officerSignsIn.task';
import {
  whenHealthcareRecommendsSharedCell,
  whenHealthcareRecommendsSingleCell,
} from './tasks/prisonersHealthcareResultsAreEntered.task';
import HealthcareSummary from './pages/healthcare/HealthcareSummary.page';
import FullAssessmentOutcomePage from './pages/FullAssessmentOutcome.page';
import FullAssessmentCompletePage from './pages/FullAssessmentComplete.page';
import DashboardPage from './pages/Dashboard.page';
import {
  whenAVulnerablePrisonerIsAssessed,
  thenTheAssessmentIsCompleted as thenRiskAssessmentIsComplete,
} from './tasks/vulnerablePrisonerAssessed.task';
import {
  whenALowRiskPrisonerIsAssessed,
  thenTheAssessmentIsCompleted,
} from './tasks/lowRiskPrisonerAssessed.task';

import andICanViewTheirAssessmentOutcomeAgain from './tasks/viewFullOutcome.task';


describe('Both assessments (Single cell outcome)', () => {
  beforeEach(() => {
    AdminPage.visit();
    expect(AdminPage.mainHeading).to.equal('Admin');
    AdminPage.clickClearButton();
    AdminPage.loadTestUsers();
  });

  afterEach(() => {
    browser.reload();
  });

  function thenTheFullAssessmentIsCompletedWith({
    riskRecommendation,
    healthRecommendation,
    finalRecommendation,
  }) {
    HealthcareSummary.clickContinue();

    expect(FullAssessmentOutcomePage.waitForMainHeadingWithDataId('full-outcome')).to.equal(
      'Risk and healthcare assessment outcome',
    );
    expect(FullAssessmentOutcomePage.prisonerName).to.equalIgnoreCase('John Lowe');
    expect(FullAssessmentOutcomePage.prisonerDob).to.equalIgnoreCase('1 October 1970');
    expect(FullAssessmentOutcomePage.prisonerNomisId).to.equalIgnoreCase('J1234LO');

    expect(FullAssessmentOutcomePage.recommendOutcome).to.match(new RegExp(`${finalRecommendation} cell`, 'i'));

    expect(FullAssessmentOutcomePage.riskRecommendation).to.equalIgnoreCase(
      `${riskRecommendation} cell`,
    );
    expect(FullAssessmentOutcomePage.healthRecommendation).to.equalIgnoreCase(
      `${healthRecommendation} cell`,
    );

    FullAssessmentOutcomePage.clickCheckbox();
    FullAssessmentOutcomePage.clickContinue();
    expect(FullAssessmentCompletePage.mainHeading).to.equal(
      'Cell sharing risk assessment complete',
    );

    FullAssessmentCompletePage.clickContinue();
    expect(DashboardPage.mainHeading).to.contain('Assessments on:');
    const row = browser.element('[data-element-id="profile-row-J1234LO"]');
    expect(row.getText()).to.equalIgnoreCase(
      `John Lowe J1234LO 1 October 1970 Complete Complete ${finalRecommendation} cell View`,
    );
  }

  it('Assesses a vulnerable prisoner', () => new Promise((resolve, reject) => {
    givenThatTheOfficerIsSignedIn();
    whenAVulnerablePrisonerIsAssessed();
    thenRiskAssessmentIsComplete().catch(reject);
    whenHealthcareRecommendsSharedCell();
    thenTheFullAssessmentIsCompletedWith({
      riskRecommendation: 'single',
      healthRecommendation: 'shared',
      finalRecommendation: 'single',
    });
    andICanViewTheirAssessmentOutcomeAgain({
      riskRecommendation: 'single cell',
      healthRecommendation: 'shared cell',
      finalRecommendation: 'single cell',
    });

    resolve();
  }));

  it('Assesses a prisoner that healthcare deem as a risk', () => new Promise((resolve, reject) => {
    givenThatTheOfficerIsSignedIn();
    whenALowRiskPrisonerIsAssessed();
    thenTheAssessmentIsCompleted({ sharedText: 'shared cell' }).catch(reject);
    whenHealthcareRecommendsSingleCell();
    thenTheFullAssessmentIsCompletedWith({
      riskRecommendation: 'shared',
      healthRecommendation: 'single',
      finalRecommendation: 'single',
    });
    andICanViewTheirAssessmentOutcomeAgain({
      riskRecommendation: 'shared cell',
      healthRecommendation: 'single cell',
      finalRecommendation: 'single cell',
    });

    resolve();
  }));
});
