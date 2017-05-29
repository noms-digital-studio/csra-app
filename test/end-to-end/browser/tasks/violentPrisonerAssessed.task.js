import DashboardPage from '../pages/Dashboard.page';
import RiskAssessmentPrisonerProfilePage from '../pages/risk-assessment/RiskAssessmentPrisonerProfile.page';
import RiskAssessmentExplanationPage from '../pages/risk-assessment/RiskAssessmentExplanation.page';
import RiskAssessmentSummaryPage from '../pages/risk-assessment/RiskAssessmentSummary.page';


function whenAViolentPrisonerIsAssessed() {
  DashboardPage.clickRiskAssessmentStartLinkForNomisId('I9876RA');
  expect(RiskAssessmentPrisonerProfilePage.mainHeading).to.contain('Confirm identity');
  expect(RiskAssessmentPrisonerProfilePage.prisonerName).to.equal('Ian Rate');

  RiskAssessmentPrisonerProfilePage.clickContinue();
  expect(RiskAssessmentExplanationPage.mainHeading).to.contain('Explain this');

  RiskAssessmentExplanationPage.confirmAndContinue();
  expect(RiskAssessmentExplanationPage.mainHeading).to.contain('Current recommendation: single cell');

  RiskAssessmentExplanationPage.clickContinue();

  expect(RiskAssessmentSummaryPage.mainHeading).to.contain('Risk assessment summary');
  expect(RiskAssessmentSummaryPage.name).to.equal('Ian Rate');
  expect(RiskAssessmentSummaryPage.dob).to.equal('23-Mar-1988');
  expect(RiskAssessmentSummaryPage.nomisId).to.equal('I9876RA');

  expect(RiskAssessmentSummaryPage.outcome).to.contain('Single cell');

  RiskAssessmentSummaryPage.clickContinue();
}

export default whenAViolentPrisonerIsAssessed;
