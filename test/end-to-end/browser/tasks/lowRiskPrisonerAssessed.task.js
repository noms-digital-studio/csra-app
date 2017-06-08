import DashboardPage from '../pages/Dashboard.page';
import RiskAssessmentPrisonerProfilePage from '../pages/risk-assessment/RiskAssessmentPrisonerProfile.page';
import RiskAssessmentExplanationPage from '../pages/risk-assessment/RiskAssessmentExplanation.page';
import RiskAssessmentCommentsPage from '../pages/risk-assessment/RiskAssessmentComments.page';
import RiskAssessmentYesNoPage from '../pages/risk-assessment/RiskAssessmentYesNo.page';
import RiskAssessmentSummaryPage from '../pages/risk-assessment/RiskAssessmentSummary.page';

function aLowRiskPrisonerIsAssessed(usesDrugs) {
  DashboardPage.clickRiskAssessmentStartLinkForNomisId('J1234LO');
  expect(RiskAssessmentPrisonerProfilePage.mainHeading).to.contain('Confirm identity');
  expect(RiskAssessmentPrisonerProfilePage.prisonerName).to.equal('John Lowe');

  RiskAssessmentPrisonerProfilePage.clickContinue();
  expect(RiskAssessmentExplanationPage.mainHeading).to.equal('Explain this');

  RiskAssessmentExplanationPage.confirmAndContinue();
  expect(RiskAssessmentExplanationPage.mainHeading).to.equalIgnoreCase('Current recommendation: shared cell');

  RiskAssessmentExplanationPage.clickContinue();
  expect(RiskAssessmentCommentsPage.mainHeading).to.equal('How do you think they feel about sharing a cell at this moment?');

  RiskAssessmentCommentsPage.commentAndContinue('sharing comment');
  expect(RiskAssessmentYesNoPage.mainHeading).to.equal('Is there any indication they might seriously hurt a cellmate?');

  RiskAssessmentYesNoPage.clickNoAndContinue();
  expect(RiskAssessmentYesNoPage.mainHeading).to.equal('Do you think they\'re vulnerable?');

  RiskAssessmentYesNoPage.clickNoAndContinue();
  expect(RiskAssessmentYesNoPage.mainHeading).to.equal('Are they part of a gang, or likely to join a gang in prison?');

  RiskAssessmentYesNoPage.clickNoAndContinue();
  expect(RiskAssessmentYesNoPage.mainHeading).to.equal('Have they used drugs in the last month?');

  if (usesDrugs) {
    RiskAssessmentYesNoPage.clickYesAndContinue();
  } else {
    RiskAssessmentYesNoPage.clickNoAndContinue();
  }
  expect(RiskAssessmentYesNoPage.mainHeading).to.equal('Do they have any hostile views or prejudices about a particular group?');

  RiskAssessmentYesNoPage.clickNoAndContinue();
  expect(RiskAssessmentYesNoPage.mainHeading).to.equal('Are there any other reasons why you would recommend they have a single cell?');

  RiskAssessmentYesNoPage.clickNoAndContinue();
  expect(RiskAssessmentSummaryPage.mainHeading).to.equal('Risk assessment summary');
  expect(RiskAssessmentSummaryPage.name).to.equalIgnoreCase('John Lowe');
  expect(RiskAssessmentSummaryPage.dob).to.equalIgnoreCase('01-Oct-1970');
  expect(RiskAssessmentSummaryPage.nomisId).to.equalIgnoreCase('J1234LO');

  expect(RiskAssessmentSummaryPage.outcome).to.equalIgnoreCase(usesDrugs ? 'shared cell with conditions' : 'shared cell');
  expect(RiskAssessmentSummaryPage.initialFeelings).to.equalIgnoreCase('sharing comment');
  expect(RiskAssessmentSummaryPage.harm).to.equalIgnoreCase('no');
  expect(RiskAssessmentSummaryPage.vulnerability).to.equalIgnoreCase('no');
  expect(RiskAssessmentSummaryPage.gang).to.equalIgnoreCase('no');

  expect(RiskAssessmentSummaryPage.narcotics).to.equalIgnoreCase(usesDrugs ? 'yes' : 'no');
  expect(RiskAssessmentSummaryPage.prejudice).to.equalIgnoreCase('no');
  expect(RiskAssessmentSummaryPage.officerComments).to.equalIgnoreCase('no');

  RiskAssessmentSummaryPage.clickContinue();
}

function whenALowRiskPrisonerIsAssessed() {
  aLowRiskPrisonerIsAssessed(false);
}

function whenALowRiskPrisonerWhoUsesDrugsIsAssessed() {
  aLowRiskPrisonerIsAssessed(true);
}

function aSharedCellIsRecommended(sharedText) {
  expect(DashboardPage.mainHeading).to.contain('Assessments on:');
  const row = browser.element('[data-profile-row=J1234LO]');
  expect(row.getText()).to.equal(`John Lowe J1234LO 01-Oct-1970 Complete Start ${sharedText}`);
}

function thenASharedCellIsRecommended() {
  aSharedCellIsRecommended('Shared cell');
}

function thenASharedCellWithConditionsIsRecommended() {
  aSharedCellIsRecommended('Shared cell with conditions');
}

export { thenASharedCellIsRecommended };
export { whenALowRiskPrisonerWhoUsesDrugsIsAssessed };
export { thenASharedCellWithConditionsIsRecommended };
export default whenALowRiskPrisonerIsAssessed;
