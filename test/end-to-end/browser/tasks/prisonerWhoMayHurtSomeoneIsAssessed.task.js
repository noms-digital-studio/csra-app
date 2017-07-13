import DashboardPage from '../pages/Dashboard.page';
import RiskAssessmentPrisonerProfilePage from '../pages/risk-assessment/RiskAssessmentPrisonerProfile.page';
import RiskAssessmentExplanationPage from '../pages/risk-assessment/RiskAssessmentExplanation.page';
import RiskAssessmentCommentsPage from '../pages/risk-assessment/RiskAssessmentComments.page';
import RiskAssessmentYesNoPage from '../pages/risk-assessment/RiskAssessmentYesNo.page';
import RiskAssessmentSummaryPage from '../pages/risk-assessment/RiskAssessmentSummary.page';

function whenAPrisonerWhoMayHurtSomeoneIsAssessed() {
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

  RiskAssessmentYesNoPage.clickYesAndContinue();

  expect(RiskAssessmentSummaryPage.mainHeading).to.equal('Risk assessment summary');
  expect(RiskAssessmentSummaryPage.name).to.equalIgnoreCase('John Lowe');
  expect(RiskAssessmentSummaryPage.dob).to.equalIgnoreCase('01-10-1970');
  expect(RiskAssessmentSummaryPage.nomisId).to.equalIgnoreCase('J1234LO');

  expect(RiskAssessmentSummaryPage.outcome).to.equalIgnoreCase('single cell');
  expect(RiskAssessmentSummaryPage.initialFeelings).to.equalIgnoreCase('sharing comment');
  expect(RiskAssessmentSummaryPage.harm).to.equalIgnoreCase('yes');

  RiskAssessmentSummaryPage.submitForm();
}

function thenASingleCellIsRecommended() {
  expect(DashboardPage.waitForMainHeadingWithDataId('dashboard')).to.contain('Assessments on:');
  const row = browser.element('[data-profile-row=J1234LO]');
  expect(row.getText()).to.equal('John Lowe J1234LO 01-10-1970 Complete Start Single cell');
}

function thenTheAssessmentIsCompleted() {
  expect(DashboardPage.waitForMainHeadingWithDataId('dashboard')).to.contain('Assessments on:');
  const row = browser.element('[data-profile-row=J1234LO]');
  expect(row.getText()).to.equal('John Lowe J1234LO 01-10-1970 Complete Start');
}

export {
  thenASingleCellIsRecommended,
  whenAPrisonerWhoMayHurtSomeoneIsAssessed,
  thenTheAssessmentIsCompleted,
};
