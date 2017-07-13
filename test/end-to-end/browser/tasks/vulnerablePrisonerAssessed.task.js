import DashboardPage from '../pages/Dashboard.page';
import RiskAssessmentPrisonerProfilePage from '../pages/risk-assessment/RiskAssessmentPrisonerProfile.page';
import RiskAssessmentExplanationPage from '../pages/risk-assessment/RiskAssessmentExplanation.page';
import RiskAssessmentCommentsPage from '../pages/risk-assessment/RiskAssessmentComments.page';
import RiskAssessmentYesNoPage from '../pages/risk-assessment/RiskAssessmentYesNo.page';
import RiskAssessmentSummaryPage from '../pages/risk-assessment/RiskAssessmentSummary.page';
import checkThatAssessmentDataWasWrittenToDatabase from '../../utils/dbAssertions';

function whenAVulnerablePrisonerIsAssessed() {
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
  RiskAssessmentYesNoPage.clickYesAndContinue();

  expect(RiskAssessmentSummaryPage.mainHeading).to.equal('Risk assessment summary');
  expect(RiskAssessmentSummaryPage.name).to.equalIgnoreCase('John Lowe');
  expect(RiskAssessmentSummaryPage.dob).to.equalIgnoreCase('01-10-1970');
  expect(RiskAssessmentSummaryPage.nomisId).to.equalIgnoreCase('J1234LO');

  expect(RiskAssessmentSummaryPage.outcome).to.equalIgnoreCase('single cell');
  expect(RiskAssessmentSummaryPage.initialFeelings).to.equalIgnoreCase('sharing comment');
  expect(RiskAssessmentSummaryPage.harm).to.equalIgnoreCase('no');
  expect(RiskAssessmentSummaryPage.vulnerability).to.equalIgnoreCase('yes');

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
  const assessmentId = row.getAttribute('data-risk-assessment-id');

  return checkThatAssessmentDataWasWrittenToDatabase({
    nomisId: 'J1234LO',
    assessmentId,
    questionData: {
      introduction: { question_id: 'introduction', question: 'Explain this', answer: '' },
      'risk-of-violence': { question_id: 'risk-of-violence', question: 'Viper result', answer: '' },
      'how-do-you-feel': {
        question_id: 'how-do-you-feel',
        question: 'How do you think they feel about sharing a cell at this moment?',
        answer: 'sharing comment',
      },
      'prison-self-assessment': {
        question_id: 'prison-self-assessment',
        question: 'Is there any indication they might seriously hurt a cellmate?',
        answer: 'no',
      },
      vulnerability: { question_id: 'vulnerability', question: "Do you think they're vulnerable?", answer: 'yes' },
    },
    sharedText: 'single cell',
  })
  ;
}

export {
  thenASingleCellIsRecommended,
  whenAVulnerablePrisonerIsAssessed,
  thenTheAssessmentIsCompleted,
};
