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
  expect(RiskAssessmentExplanationPage.mainHeading).to.contain('Explain this');

  RiskAssessmentExplanationPage.confirmAndContinue();
  expect(RiskAssessmentExplanationPage.mainHeading).to.contain('No prisoner record');

  RiskAssessmentExplanationPage.clickContinue();
  expect(RiskAssessmentCommentsPage.mainHeading).to.contain('How do you think they feel about sharing a cell at this moment?');

  RiskAssessmentCommentsPage.commentAndContinue('sharing comment');
  expect(RiskAssessmentYesNoPage.mainHeading).to.contain('Is there any indication they might seriously hurt a cellmate?');

  RiskAssessmentYesNoPage.clickNoAndContinue();
  expect(RiskAssessmentYesNoPage.mainHeading).to.contain('Do you think they\'re vulnerable?');

  RiskAssessmentYesNoPage.clickNoAndContinue();
  expect(RiskAssessmentYesNoPage.mainHeading).to.contain('Are they part of a gang, or likely to join a gang in prison?');

  RiskAssessmentYesNoPage.clickNoAndContinue();
  expect(RiskAssessmentYesNoPage.mainHeading).to.contain('Have they used drugs in the last month?');

  RiskAssessmentYesNoPage.clickNoAndContinue();
  expect(RiskAssessmentYesNoPage.mainHeading).to.contain('Do they have any hostile views or prejudices about a particular group?');

  RiskAssessmentYesNoPage.clickNoAndContinue();
  expect(RiskAssessmentYesNoPage.mainHeading).to.contain('Are there any other reasons why you would recommend they have a single cell?');

  RiskAssessmentYesNoPage.clickNoAndContinue();
  expect(RiskAssessmentSummaryPage.mainHeading).to.contain('Risk assessment summary');
  expect(RiskAssessmentSummaryPage.name).to.equal('James Neo');
  expect(RiskAssessmentSummaryPage.dob).to.equal('03-Dec-1958');
  expect(RiskAssessmentSummaryPage.nomisId).to.equal('J6285NE');

  expect(RiskAssessmentSummaryPage.outcome).to.contain('Single cell');
  expect(RiskAssessmentSummaryPage.initialFeelings).to.contain('sharing comment');
  expect(RiskAssessmentSummaryPage.harm).to.contain('no');
  expect(RiskAssessmentSummaryPage.vulnerability).to.contain('no');
  expect(RiskAssessmentSummaryPage.gang).to.contain('no');

  expect(RiskAssessmentSummaryPage.narcotics).to.contain('no');
  expect(RiskAssessmentSummaryPage.prejudice).to.contain('no');
  expect(RiskAssessmentSummaryPage.officerComments).to.contain('no');


  RiskAssessmentSummaryPage.clickContinue();
}

export default whenAPrisonerWithNoViperIsAssessed;
