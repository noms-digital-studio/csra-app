import DashboardPage from '../pages/Dashboard.page';
import RiskAssessmentPrisonerProfilePage from '../pages/risk-assessment/RiskAssessmentPrisonerProfile.page';
import RiskAssessmentExplanationPage from '../pages/risk-assessment/RiskAssessmentExplanation.page';
import RiskAssessmentSummaryPage from '../pages/risk-assessment/RiskAssessmentSummary.page';


function whenAViolentPrisonerIsAssessed() {
  DashboardPage.clickRiskAssessmentStartLinkForNomisId('I9876RA');
  expect(RiskAssessmentPrisonerProfilePage.mainHeading).to.contain('Confirm identity');
  expect(RiskAssessmentPrisonerProfilePage.prisonerName).to.equal('Ian Rate');

  RiskAssessmentPrisonerProfilePage.clickContinue();
  expect(RiskAssessmentExplanationPage.mainHeading).to.equal('Explain this');

  RiskAssessmentExplanationPage.confirmAndContinue();
  expect(RiskAssessmentExplanationPage.mainHeading).to.equalIgnoreCase('Current recommendation: single cell');

  RiskAssessmentExplanationPage.clickContinue();

  expect(RiskAssessmentSummaryPage.mainHeading).to.equal('Risk assessment summary');
  expect(RiskAssessmentSummaryPage.name).to.equalIgnoreCase('Ian Rate');
  expect(RiskAssessmentSummaryPage.dob).to.equalIgnoreCase('23-03-1988');
  expect(RiskAssessmentSummaryPage.nomisId).to.equalIgnoreCase('I9876RA');

  expect(RiskAssessmentSummaryPage.outcome).to.equalIgnoreCase('single cell');

  RiskAssessmentSummaryPage.submitForm();
}

export default whenAViolentPrisonerIsAssessed;
