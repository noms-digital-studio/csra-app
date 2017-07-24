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
import { checkThatAssessmentDataWasWrittenToDatabaseSync } from '../../utils/dbAssertions';

const defaultAssessmentConfig = {
  prisoner: {
    nomisId: 'J1234LO',
    name: 'John Lowe',
    dob: '1 October 1970',
  },
  initialRecommendation: 'shared cell',
  answers: {
    harmCellMate: 'no',
    vulnerability: 'no',
    gangAffiliation: 'no',
    drugMisuse: 'no',
    prejudice: 'no',
    officersAssessment: 'no',
  },
  finalRecommendation: 'shared cell',
  reasons: [],
  viperScore: 0.35,
};

const selectYesNoAnswer = (answer) => {
  if (answer === 'yes') {
    RiskAssessmentYesNoPage.clickYesAndContinue();
  } else {
    RiskAssessmentYesNoPage.clickNoAndContinue();
  }
};

const caseInSensitive = text => new RegExp(text, 'i');

export const whenPrisonerIsAssessed = (config = defaultAssessmentConfig) => {
  DashboardPage.startRiskAssessmentFor(config.prisoner.nomisId);

  expect(RiskAssessmentPrisonerProfilePage.mainHeading).to.contain('Confirm identity');
  expect(RiskAssessmentPrisonerProfilePage.prisonerName).to.equal(config.prisoner.name);
  RiskAssessmentPrisonerProfilePage.clickContinue();

  expect(RiskAssessmentExplanationPage.mainHeading).to.equal('Making this process fair and open');
  RiskAssessmentExplanationPage.confirmAndContinue();

  expect(
    RiskAssessmentExplanationPage.mainHeading,
  ).to.match(caseInSensitive(config.initialRecommendation));
  RiskAssessmentExplanationPage.clickContinue();

  expect(RiskAssessmentCommentsPage.mainHeading).to.equal('How do you think they feel about sharing a cell at this moment?');
  RiskAssessmentCommentsPage.commentAndContinue('foo comment');

  expect(RiskAssessmentYesNoPage.mainHeading).to.equal('Is there any genuine indication they might seriously hurt a cellmate?');
  selectYesNoAnswer(config.answers.harmCellMate);

  expect(RiskAssessmentYesNoPage.mainHeading).to.equal("Do you think they're likely to lash out because they're scared or feeling vulnerable?");
  selectYesNoAnswer(config.answers.vulnerability);

  expect(RiskAssessmentYesNoPage.mainHeading).to.equal('Are they in a gang?');
  selectYesNoAnswer(config.answers.gangAffiliation);

  expect(RiskAssessmentYesNoPage.mainHeading).to.equal('Have they taken illicit drugs in the last month?');
  selectYesNoAnswer(config.answers.drugMisuse);

  expect(RiskAssessmentYesNoPage.mainHeading).to.equal('Do they have any hostile views or prejudices?');
  selectYesNoAnswer(config.answers.prejudice);

  expect(RiskAssessmentYesNoPage.mainHeading).to.equal('Are there any other reasons why you would recommend they have a single cell?');
  selectYesNoAnswer(config.answers.officersAssessment);

  expect(RiskAssessmentSummaryPage.mainHeading).to.equal('Risk assessment summary');
  expect(RiskAssessmentSummaryPage.prisonerName).to.equalIgnoreCase(config.prisoner.name);
  expect(RiskAssessmentSummaryPage.prisonerDob).to.equalIgnoreCase(config.prisoner.dob);
  expect(RiskAssessmentSummaryPage.prisonerNomisId).to.equalIgnoreCase(config.prisoner.nomisId);
  expect(RiskAssessmentSummaryPage.outcome).to.match(caseInSensitive(config.finalRecommendation));
  expect(RiskAssessmentSummaryPage.initialFeelings).to.equalIgnoreCase('foo comment');
  expect(RiskAssessmentSummaryPage.harm).to.equalIgnoreCase(config.answers.harmCellMate);
  expect(RiskAssessmentSummaryPage.vulnerability).to.equalIgnoreCase(config.answers.vulnerability);
  expect(RiskAssessmentSummaryPage.gang).to.equalIgnoreCase(config.answers.gangAffiliation);
  expect(RiskAssessmentSummaryPage.narcotics).to.equalIgnoreCase(config.answers.drugMisuse);
  expect(RiskAssessmentSummaryPage.prejudice).to.equalIgnoreCase(config.answers.prejudice);
  expect(
    RiskAssessmentSummaryPage.officerComments,
  ).to.equalIgnoreCase(config.answers.officersAssessment);

  RiskAssessmentSummaryPage.clickContinue();
};


export const fullAssessmentRecommendation = (config) => {
  expect(DashboardPage.mainHeading).to.contain('Assessments on:');
  const row = browser.element(`[data-element-id="profile-row-${config.prisoner.nomisId}"]`);
  expect(row.getText()).to.equal(
    `${config.prisoner.name} ${config.prisoner.nomisId} ${config.prisoner.dob} Complete Start ${config.finalRecommendation}`,
  );
};


export const thenTheAssessmentIsCompleted = (config = defaultAssessmentConfig) => {
  DashboardPage.waitForMainHeadingWithDataId('dashboard');

  const row = browser.element(`[data-element-id="profile-row-${config.prisoner.nomisId}"]`);
  const assessmentId = row.getAttribute('data-risk-assessment-id');

  expect(row.getText()).to.equal(
    `${config.prisoner.name} ${config.prisoner.nomisId} ${config.prisoner.dob} Complete Start`,
  );

  expect(assessmentId).to.not.equal(undefined, 'expected to find data-risk-assessment-id on the page');

  checkThatAssessmentDataWasWrittenToDatabaseSync({
    nomisId: config.prisoner.nomisId,
    assessmentId,
    questionData: {
      introduction: {
        question_id: 'introduction',
        question: 'Making this process fair and open',
        answer: '',
      },
      'risk-of-violence': { question_id: 'risk-of-violence', question: 'Viper result', answer: '' },
      'how-do-you-feel': {
        question_id: 'how-do-you-feel',
        question: 'How do you think they feel about sharing a cell at this moment?',
        answer: 'foo comment',
      },
      'harm-cell-mate': {
        question_id: 'harm-cell-mate',
        question: 'Is there any genuine indication they might seriously hurt a cellmate?',
        answer: config.answers.harmCellMate,
      },
      vulnerability: {
        question_id: 'vulnerability',
        question: "Do you think they're likely to lash out because they're scared or feeling vulnerable?",
        answer: config.answers.vulnerability,
      },
      'gang-affiliation': {
        question_id: 'gang-affiliation',
        question: 'Are they in a gang?',
        answer: config.answers.gangAffiliation,
      },
      'drug-misuse': {
        question_id: 'drug-misuse',
        question: 'Have they taken illicit drugs in the last month?',
        answer: config.answers.drugMisuse,
      },
      prejudice: {
        question_id: 'prejudice',
        question: 'Do they have any hostile views or prejudices?',
        answer: config.answers.prejudice,
      },
      'officers-assessment': {
        question_id: 'officers-assessment',
        question: 'Are there any other reasons why you would recommend they have a single cell?',
        answer: config.answers.officersAssessment,
      },
    },
    reasons: config.reasons,
    assessmentOutcome: config.finalRecommendation,
    viperScore: config.viperScore,
  });
};