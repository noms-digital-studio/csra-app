import DashboardPage from '../pages/Dashboard.page';
import RiskAssessmentPrisonerProfilePage from '../pages/risk-assessment/RiskAssessmentPrisonerProfile.page';
import RiskAssessmentExplanationPage from '../pages/risk-assessment/RiskAssessmentExplanation.page';
import RiskAssessmentCommentsPage from '../pages/risk-assessment/RiskAssessmentComments.page';
import RiskAssessmentYesNoPage from '../pages/risk-assessment/RiskAssessmentYesNo.page';
import RiskAssessmentSummaryPage from '../pages/risk-assessment/RiskAssessmentSummary.page';

function whenAPrisonerWithNoViperIsAssessed() {
  DashboardPage.clickRiskAssessmentStartLinkForNomisId('J6285NE');
  expect(RiskAssessmentPrisonerProfilePage.mainHeading).to.contain('Confirm identity');
  expect(RiskAssessmentPrisonerProfilePage.prisonerName).to.equal('James Neo');

  RiskAssessmentPrisonerProfilePage.clickContinue();
  expect(RiskAssessmentExplanationPage.mainHeading).to.equal('Explain this');

  RiskAssessmentExplanationPage.confirmAndContinue();
  expect(RiskAssessmentExplanationPage.mainHeading).to.equal('No predictor data available:');

  RiskAssessmentExplanationPage.clickContinue();
  expect(RiskAssessmentCommentsPage.mainHeading).to.equal('How do you think they feel about sharing a cell at this moment?');

  RiskAssessmentCommentsPage.commentAndContinue('sharing comment');
  expect(RiskAssessmentYesNoPage.mainHeading).to.equal('Is there any genuine indication they might seriously hurt a cellmate?');

  RiskAssessmentYesNoPage.clickNoAndContinue();
  expect(RiskAssessmentYesNoPage.mainHeading).to.equal('Do you think they\'re vulnerable?');

  RiskAssessmentYesNoPage.clickNoAndContinue();
  expect(RiskAssessmentYesNoPage.mainHeading).to.equal('Are they in a gang?');

  RiskAssessmentYesNoPage.clickNoAndContinue();
  expect(RiskAssessmentYesNoPage.mainHeading).to.equal('Have they taken illicit drugs in the last month?');

  RiskAssessmentYesNoPage.clickNoAndContinue();
  expect(RiskAssessmentYesNoPage.mainHeading).to.equal('Do they have any hostile views or prejudices?');

  RiskAssessmentYesNoPage.clickNoAndContinue();
  expect(RiskAssessmentYesNoPage.mainHeading).to.equal('Are there any other reasons why you would recommend they have a single cell?');

  RiskAssessmentYesNoPage.clickNoAndContinue();
  expect(RiskAssessmentSummaryPage.mainHeading).to.equal('Risk assessment summary');
  expect(RiskAssessmentSummaryPage.name).to.equalIgnoreCase('James Neo');
  expect(RiskAssessmentSummaryPage.dob).to.equalIgnoreCase('03-12-1958');
  expect(RiskAssessmentSummaryPage.nomisId).to.equalIgnoreCase('J6285NE');

  expect(RiskAssessmentSummaryPage.outcome).to.equalIgnoreCase('Shared cell');
  expect(RiskAssessmentSummaryPage.initialFeelings).to.equalIgnoreCase('sharing comment');
  expect(RiskAssessmentSummaryPage.harm).to.equalIgnoreCase('No');
  expect(RiskAssessmentSummaryPage.vulnerability).to.equalIgnoreCase('No');
  expect(RiskAssessmentSummaryPage.gang).to.equalIgnoreCase('No');

  expect(RiskAssessmentSummaryPage.narcotics).to.equalIgnoreCase('No');
  expect(RiskAssessmentSummaryPage.prejudice).to.equalIgnoreCase('No');
  expect(RiskAssessmentSummaryPage.officerComments).to.equalIgnoreCase('No');


  RiskAssessmentSummaryPage.clickContinue();
}

export default whenAPrisonerWithNoViperIsAssessed;
