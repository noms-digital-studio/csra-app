import DashboardPage from '../pages/Dashboard.page';
import RiskAssessmentPrisonerProfilePage from '../pages/risk-assessment/RiskAssessmentPrisonerProfile.page';
import RiskAssessmentExplanationPage from '../pages/risk-assessment/RiskAssessmentExplanation.page';
import RiskAssessmentSummaryPage from '../pages/risk-assessment/RiskAssessmentSummary.page';


function whenAViolentPrisonerIsAssessed() {
  DashboardPage.clickRiskAssessmentStartLinkForNomisId('I9876RA');
  expect(RiskAssessmentPrisonerProfilePage.mainHeading).to.contain('Confirm identity');
  expect(RiskAssessmentPrisonerProfilePage.prisonerName).to.equal('Ian Rate');

  RiskAssessmentPrisonerProfilePage.clickContinue();
  expect(RiskAssessmentExplanationPage.mainHeading).to.equal('Making this process fair and open');

  RiskAssessmentExplanationPage.confirmAndContinue();
  expect(RiskAssessmentExplanationPage.mainHeading).to.equalIgnoreCase('Current recommendation: single cell');

  RiskAssessmentExplanationPage.clickContinue();

  expect(RiskAssessmentSummaryPage.mainHeading).to.equal('Risk assessment summary');
  expect(RiskAssessmentSummaryPage.prisonerName).to.equalIgnoreCase('Ian Rate');
  expect(RiskAssessmentSummaryPage.prisonerDob).to.equalIgnoreCase('23 March 1988');
  expect(RiskAssessmentSummaryPage.prisonerNomisId).to.equalIgnoreCase('I9876RA');

  expect(RiskAssessmentSummaryPage.outcome).to.equalIgnoreCase('single cell');

  RiskAssessmentSummaryPage.clickContinue();
}

export default whenAViolentPrisonerIsAssessed;
