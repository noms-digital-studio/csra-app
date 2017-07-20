import DashboardPage from '../pages/Dashboard.page';
import RiskAssessmentPrisonerProfilePage from '../pages/risk-assessment/RiskAssessmentPrisonerProfile.page';
import RiskAssessmentExplanationPage from '../pages/risk-assessment/RiskAssessmentExplanation.page';
import RiskAssessmentCommentsPage from '../pages/risk-assessment/RiskAssessmentComments.page';
import RiskAssessmentYesNoPage from '../pages/risk-assessment/RiskAssessmentYesNo.page';
import RiskAssessmentSummaryPage from '../pages/risk-assessment/RiskAssessmentSummary.page';
import { checkThatAssessmentDataWasWrittenToDatabaseSync } from '../../utils/dbAssertions';

function whenAVulnerablePrisonerIsAssessed() {
  DashboardPage.clickRiskAssessmentStartLinkForNomisId('J1234LO');
  expect(RiskAssessmentPrisonerProfilePage.mainHeading).to.contain('Confirm identity');
  expect(RiskAssessmentPrisonerProfilePage.prisonerName).to.equal('John Lowe');

  RiskAssessmentPrisonerProfilePage.clickContinue();
  expect(RiskAssessmentExplanationPage.mainHeading).to.equal('Making this process fair and open');

  RiskAssessmentExplanationPage.confirmAndContinue();
  expect(RiskAssessmentExplanationPage.mainHeading).to.equalIgnoreCase('Current recommendation: shared cell');

  RiskAssessmentExplanationPage.clickContinue();
  expect(RiskAssessmentCommentsPage.mainHeading).to.equal('How do you think they feel about sharing a cell at this moment?');

  RiskAssessmentCommentsPage.commentAndContinue('sharing comment');
  expect(RiskAssessmentYesNoPage.mainHeading).to.equal('Is there any genuine indication they might seriously hurt a cellmate?');

  RiskAssessmentYesNoPage.clickNoAndContinue();
  expect(RiskAssessmentYesNoPage.mainHeading).to.equal("Do you think they're likely to lash out because they're scared or feeling vulnerable?");
  RiskAssessmentYesNoPage.clickYesAndContinue();

  expect(RiskAssessmentSummaryPage.mainHeading).to.equal('Risk assessment summary');
  expect(RiskAssessmentSummaryPage.prisonerName).to.equalIgnoreCase('John Lowe');
  expect(RiskAssessmentSummaryPage.prisonerDob).to.equalIgnoreCase('1 October 1970');
  expect(RiskAssessmentSummaryPage.prisonerNomisId).to.equalIgnoreCase('J1234LO');

  expect(RiskAssessmentSummaryPage.outcome).to.equalIgnoreCase('single cell');
  expect(RiskAssessmentSummaryPage.initialFeelings).to.equalIgnoreCase('sharing comment');
  expect(RiskAssessmentSummaryPage.harm).to.equalIgnoreCase('no');
  expect(RiskAssessmentSummaryPage.vulnerability).to.equalIgnoreCase('yes');

  RiskAssessmentSummaryPage.clickContinue();
}

function thenASingleCellIsRecommended() {
  expect(DashboardPage.waitForMainHeadingWithDataId('dashboard')).to.contain('Assessments on:');
  const row = browser.element('[data-element-id="profile-row-J1234LO"]');
  expect(row.getText()).to.equal('John Lowe J1234LO 1 October 1970 Complete Start Single cell');
}

function thenTheAssessmentIsCompleted() {
  expect(DashboardPage.waitForMainHeadingWithDataId('dashboard')).to.contain('Assessments on:');
  const row = browser.element('[data-element-id="profile-row-J1234LO"]');
  expect(row.getText()).to.equal('John Lowe J1234LO 1 October 1970 Complete Start');
  const assessmentId = row.getAttribute('data-risk-assessment-id');

  checkThatAssessmentDataWasWrittenToDatabaseSync({
    nomisId: 'J1234LO',
    assessmentId,
    questionData: {
      introduction: { question_id: 'introduction', question: 'Making this process fair and open', answer: '' },
      'risk-of-violence': { question_id: 'risk-of-violence', question: 'Viper result', answer: '' },
      'how-do-you-feel': {
        question_id: 'how-do-you-feel',
        question: 'How do you think they feel about sharing a cell at this moment?',
        answer: 'sharing comment',
      },
      'prison-self-assessment': {
        question_id: 'prison-self-assessment',
        question: 'Is there any genuine indication they might seriously hurt a cellmate?',
        answer: 'no',
      },
      vulnerability: { question_id: 'vulnerability', question: "Do you think they're likely to lash out because they're scared or feeling vulnerable?", answer: 'yes' },
    },
    sharedText: 'single cell',
  });
}

export {
  thenASingleCellIsRecommended,
  whenAVulnerablePrisonerIsAssessed,
  thenTheAssessmentIsCompleted,
};
