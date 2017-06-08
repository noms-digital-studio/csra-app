import AdminPage from './pages/Admin.page';
import { givenThatTheOfficerIsSignedIn } from './tasks/officerSignsIn.task';
import { whenHealthcareRecommendsSharedCell,
  whenHealthcareRecommendsSingleCell,
} from './tasks/prisonersHealthcareResultsAreEntered.task';
import HealthcareSummary from './pages/healthcare/HealthcareSummary.page';
import FullAssessmentOutcomePage from './pages/FullAssessmentOutcome.page';
import FullAssessmentCompletePage from './pages/FullAssessmentComplete.page';
import DashboardPage from './pages/Dashboard.page';
import { whenAVulnerablePrisonerIsAssessed, thenASingleCellIsRecommended } from './tasks/vulnerablePrisonerAssessed.task';
import { whenALowRiskPrisonerIsAssessed, thenASharedCellIsRecommended } from './tasks/lowRiskPrisonerAssessed.task';

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

  function thenTheFullAssessmentIsCompletedWith({ riskRecommendation, healthRecommendation }) {
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

  it('Assesses a vulnerable prisoner', () => {
    givenThatTheOfficerIsSignedIn();
    whenAVulnerablePrisonerIsAssessed();
    thenASingleCellIsRecommended();
    whenHealthcareRecommendsSharedCell();
    thenTheFullAssessmentIsCompletedWith({ riskRecommendation: 'single', healthRecommendation: 'shared' });
  });

  it('Assesses a prisoner that healthcare deem as a risk', () => {
    givenThatTheOfficerIsSignedIn();
    whenALowRiskPrisonerIsAssessed();
    thenASharedCellIsRecommended();
    whenHealthcareRecommendsSingleCell();
    thenTheFullAssessmentIsCompletedWith({ riskRecommendation: 'shared', healthRecommendation: 'single' });
  });
});
