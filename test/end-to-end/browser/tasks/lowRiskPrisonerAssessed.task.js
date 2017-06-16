import DashboardPage from '../pages/Dashboard.page';
import RiskAssessmentPrisonerProfilePage
  from '../pages/risk-assessment/RiskAssessmentPrisonerProfile.page';
import RiskAssessmentExplanationPage
  from '../pages/risk-assessment/RiskAssessmentExplanation.page';
import RiskAssessmentCommentsPage
  from '../pages/risk-assessment/RiskAssessmentComments.page';
import RiskAssessmentYesNoPage
  from '../pages/risk-assessment/RiskAssessmentYesNo.page';
import RiskAssessmentSummaryPage
  from '../pages/risk-assessment/RiskAssessmentSummary.page';
import db from '../../../util/db';

function aLowRiskPrisonerIsAssessed(usesDrugs) {
  DashboardPage.clickRiskAssessmentStartLinkForNomisId('J1234LO');
  expect(RiskAssessmentPrisonerProfilePage.mainHeading).to.contain(
    'Confirm identity',
  );
  expect(RiskAssessmentPrisonerProfilePage.prisonerName).to.equal('John Lowe');

  RiskAssessmentPrisonerProfilePage.clickContinue();
  expect(RiskAssessmentExplanationPage.mainHeading).to.equal('Explain this');

  RiskAssessmentExplanationPage.confirmAndContinue();
  expect(RiskAssessmentExplanationPage.mainHeading).to.equalIgnoreCase(
    'Current recommendation: shared cell',
  );

  RiskAssessmentExplanationPage.clickContinue();
  expect(RiskAssessmentCommentsPage.mainHeading).to.equal(
    'How do you think they feel about sharing a cell at this moment?',
  );

  RiskAssessmentCommentsPage.commentAndContinue('sharing comment');
  expect(RiskAssessmentYesNoPage.mainHeading).to.equal(
    'Is there any indication they might seriously hurt a cellmate?',
  );

  RiskAssessmentYesNoPage.clickNoAndContinue();
  expect(RiskAssessmentYesNoPage.mainHeading).to.equal(
    "Do you think they're vulnerable?",
  );

  RiskAssessmentYesNoPage.clickNoAndContinue();
  expect(RiskAssessmentYesNoPage.mainHeading).to.equal(
    'Are they part of a gang, or likely to join a gang in prison?',
  );

  RiskAssessmentYesNoPage.clickNoAndContinue();
  expect(RiskAssessmentYesNoPage.mainHeading).to.equal(
    'Have they used drugs in the last month?',
  );

  if (usesDrugs) {
    RiskAssessmentYesNoPage.clickYesAndContinue();
  } else {
    RiskAssessmentYesNoPage.clickNoAndContinue();
  }
  expect(RiskAssessmentYesNoPage.mainHeading).to.equal(
    'Do they have any hostile views or prejudices about a particular group?',
  );

  RiskAssessmentYesNoPage.clickNoAndContinue();
  expect(RiskAssessmentYesNoPage.mainHeading).to.equal(
    'Are there any other reasons why you would recommend they have a single cell?',
  );

  RiskAssessmentYesNoPage.clickNoAndContinue();
  expect(RiskAssessmentSummaryPage.mainHeading).to.equal(
    'Risk assessment summary',
  );
  expect(RiskAssessmentSummaryPage.name).to.equalIgnoreCase('John Lowe');
  expect(RiskAssessmentSummaryPage.dob).to.equalIgnoreCase('01-Oct-1970');
  expect(RiskAssessmentSummaryPage.nomisId).to.equalIgnoreCase('J1234LO');

  expect(RiskAssessmentSummaryPage.outcome).to.equalIgnoreCase(
    usesDrugs ? 'shared cell with conditions' : 'shared cell',
  );
  expect(RiskAssessmentSummaryPage.initialFeelings).to.equalIgnoreCase(
    'sharing comment',
  );
  expect(RiskAssessmentSummaryPage.harm).to.equalIgnoreCase('no');
  expect(RiskAssessmentSummaryPage.vulnerability).to.equalIgnoreCase('no');
  expect(RiskAssessmentSummaryPage.gang).to.equalIgnoreCase('no');

  expect(RiskAssessmentSummaryPage.narcotics).to.equalIgnoreCase(
    usesDrugs ? 'yes' : 'no',
  );
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
  expect(row.getText()).to.equal(
    `John Lowe J1234LO 01-Oct-1970 Complete Start ${sharedText}`,
  );
}

function thenTheAssessmentIsCompleted(resolve) {
  expect(DashboardPage.waitForMainHeadingWithDataId('dashboard')).to.contain('Assessments on:');
  const row = browser.element('[data-profile-row=J1234LO]');
  expect(row.getText()).to.equal(
    'John Lowe J1234LO 01-Oct-1970 Complete Start',
  );

  const assessmentId = row.getAttribute('data-profile-id');
  db.select().table('assessments').where('assessment_id', Number(assessmentId)).then(
    (result) => {
      expect(result[0].nomis_id).to.equal('J1234LO');
      expect(result[0].timestamp).to.not.equal(undefined, 'expected a timestamp');
      expect(result[0].questions_hash).to.not.equal(undefined, 'expected a questions_hash');
      expect(result[0].git_version).to.not.equal(undefined, 'expected a git_version');
      expect(result[0].git_date).to.not.equal(undefined, 'expected a git_date');
      expect(result[0].type).to.equal('risk');
      expect(result[0].outcome).to.equal('shared cell');
      expect(result[0].reasons).to.equal('[]');
      expect(result[0].questions).to.equal('{"introduction":{"question_id":"introduction","question":"Explain this","answer":""},"risk-of-violence":{"question_id":"risk-of-violence","question":"Viper result","answer":""},"how-do-you-feel":{"question_id":"how-do-you-feel","question":"How do you think they feel about sharing a cell at this moment?","answer":"sharing comment"},"prison-self-assessment":{"question_id":"prison-self-assessment","question":"Is there any indication they might seriously hurt a cellmate?","answer":"no"},"vulnerability":{"question_id":"vulnerability","question":"Do you think they\'re vulnerable?","answer":"no"},"gang-affiliation":{"question_id":"gang-affiliation","question":"Are they part of a gang, or likely to join a gang in prison?","answer":"no"},"drug-misuse":{"question_id":"drug-misuse","question":"Have they used drugs in the last month?","answer":"no"},"prejudice":{"question_id":"prejudice","question":"Do they have any hostile views or prejudices about a particular group?","answer":"no"},"officers-assessment":{"question_id":"officers-assessment","question":"Are there any other reasons why you would recommend they have a single cell?","answer":"no"}}');
      expect(result[0].viper).to.equal(0.35);
      resolve();
    });
}

function thenASharedCellIsRecommended() {
  aSharedCellIsRecommended('Shared cell');
}

function thenASharedCellWithConditionsIsRecommended() {
  aSharedCellIsRecommended('Shared cell with conditions');
}

export {
  thenASharedCellIsRecommended,
  whenALowRiskPrisonerWhoUsesDrugsIsAssessed,
  thenASharedCellWithConditionsIsRecommended,
  whenALowRiskPrisonerIsAssessed,
  thenTheAssessmentIsCompleted,
};
