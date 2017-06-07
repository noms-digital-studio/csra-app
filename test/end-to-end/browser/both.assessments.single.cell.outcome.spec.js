/* eslint-disable import/no-duplicates */
import AdminPage from './pages/Admin.page';
import givenThatTheOfficerIsSignedIn from './tasks/officerSignsIn.task';
import whenAPrisonersHealthcareResultsAreEntered from './tasks/prisonersHealthcareResultsAreEntered.task';
import HealthcareSummary from './pages/healthcare/HealthcareSummary.page';
import FullAssessmentOutcomePage from './pages/FullAssessmentOutcome.page';
import FullAssessmentCompletePage from './pages/FullAssessmentComplete.page';
import DashboardPage from './pages/Dashboard.page';
import whenAVulnerablePrisonerIsAssessed from './tasks/vulnerablePrisonerAssessed.task';
import { thenASingleCellIsRecommended } from './tasks/vulnerablePrisonerAssessed.task';
import whenALowRiskPrisonerIsAssessed from './tasks/lowRiskPrisonerAssessed.task';
import { thenASharedCellIsRecommended } from './tasks/lowRiskPrisonerAssessed.task';

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

  function thenTheFullAssessmentIsCompleted(riskRecommendation, healthRecommendation) {
    HealthcareSummary.clickContinue();
    expect(FullAssessmentOutcomePage.mainHeading).to.equal('Risk and healthcare assessment outcome');
    expect(FullAssessmentOutcomePage.name).to.equalIgnoreCase('John Lowe');
    expect(FullAssessmentOutcomePage.dob).to.equalIgnoreCase('01-Oct-1970');
    expect(FullAssessmentOutcomePage.nomisId).to.equalIgnoreCase('J1234LO');
    expect(FullAssessmentOutcomePage.riskRecommendation).to.equalIgnoreCase(`${riskRecommendation} cell`);
    expect(FullAssessmentOutcomePage.healthRecommendation).to.equalIgnoreCase(`${healthRecommendation} cell`);

    FullAssessmentOutcomePage.clickCheckbox();
    FullAssessmentOutcomePage.clickContinue();
    expect(FullAssessmentCompletePage.mainHeading).to.equal('Cell sharing risk assessment complete');

    FullAssessmentCompletePage.clickContinue();
    expect(DashboardPage.mainHeading).to.contain('Assessments on:');
    const row = browser.element('[data-profile-row=J1234LO]');
    expect(row.getText()).to.equalIgnoreCase(`John Lowe J1234LO 01-Oct-1970 Complete Complete ${riskRecommendation} Cell`);
  }

  it('Assesses a vulnerable risk prisoner', () => {
    givenThatTheOfficerIsSignedIn();
    whenAVulnerablePrisonerIsAssessed();
    thenASingleCellIsRecommended();
    whenAPrisonersHealthcareResultsAreEntered(false);
    thenTheFullAssessmentIsCompleted('single', 'shared');
  });

  it('Assesses a healthcare risk prisoner', () => {
    givenThatTheOfficerIsSignedIn();
    whenALowRiskPrisonerIsAssessed();
    thenASharedCellIsRecommended();
    whenAPrisonersHealthcareResultsAreEntered(true);
    thenTheFullAssessmentIsCompleted('shared', 'single');
  });
});
