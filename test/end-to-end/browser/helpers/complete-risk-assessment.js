import { ELEMENT_SEARCH_TIMEOUT } from '../../constants';
import DashboardPage from '../pages/Dashboard.page';
import RiskAssessmentPrisonerProfilePage from '../pages/risk-assessment/RiskAssessmentPrisonerProfile.page';
import RiskAssessmentExplanationPage from '../pages/risk-assessment/RiskAssessmentExplanation.page';
import RiskAssessmentYesNoPage from '../pages/risk-assessment/RiskAssessmentYesNo.page';
import RiskAssessmentSummaryPage from '../pages/risk-assessment/RiskAssessmentSummary.page';
import { checkThatRiskAssessmentDataWasWrittenToDatabaseSync } from '../../utils/dbAssertions';
import { parseDate } from '../../../../client/javascript/utils';


const defaultAssessmentConfig = {
  prisoner: {
    nomisId: 'A1401AE',
    name: 'Jilly Hall',
    dateOfBirth: '1 January 1970',
  },
  initialRecommendation: 'The predictor has found this person in its records',
  answers: {
    harmCellMate: 'no',
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
  if (config.smokeTest) {
    browser.url('/dashboard?displayTestAssessments=true');
  }

  const officerName = browser.getAttribute('[data-header-name]', 'data-header-name');
  const assessmentDate = parseDate(new Date());

  expect(DashboardPage.waitForMainHeadingWithDataId('dashboard')).to.contain('All assessments');

  DashboardPage.startRiskAssessmentFor(config.prisoner.nomisId);

  expect(RiskAssessmentPrisonerProfilePage.waitForMainHeadingWithDataId('prisoner-confirmation')).to.contain('Confirm identity');
  expect(RiskAssessmentPrisonerProfilePage.prisonerName).to.equal(config.prisoner.name);
  RiskAssessmentPrisonerProfilePage.clickContinue();

  expect(RiskAssessmentExplanationPage.waitForMainHeadingWithDataId('introduction')).to.equal('Making this process fair and open');
  RiskAssessmentExplanationPage.confirmAndContinue();

  expect(RiskAssessmentExplanationPage.viperHeading).to.equal(config.initialRecommendation);
  RiskAssessmentExplanationPage.clickContinue();

  expect(RiskAssessmentYesNoPage.waitForMainHeadingWithDataId('harm-cell-mate')).to.equal('Is there any genuine indication they might seriously hurt a cellmate?');
  RiskAssessmentYesNoPage.enterComment('A harmCellMate generic comment');
  selectYesNoAnswer(config.answers.harmCellMate);


  expect(RiskAssessmentYesNoPage.waitForMainHeadingWithDataId('gang-affiliation')).to.equal('Are they in a gang?');
  selectYesNoAnswer(config.answers.gangAffiliation);

  expect(RiskAssessmentYesNoPage.waitForMainHeadingWithDataId('drug-misuse')).to.equal('Have they taken illicit drugs in the last month?');
  selectYesNoAnswer(config.answers.drugMisuse);

  expect(RiskAssessmentYesNoPage.waitForMainHeadingWithDataId('prejudice')).to.equal('Do they have any hostile views or prejudices?');
  selectYesNoAnswer(config.answers.prejudice);

  expect(RiskAssessmentYesNoPage.waitForMainHeadingWithDataId('officers-assessment')).to.equal('Are there any other reasons why you would recommend they have a single cell?');
  selectYesNoAnswer(config.answers.officersAssessment);

  expect(RiskAssessmentSummaryPage.waitForMainHeadingWithDataId('risk-summary')).to.equal('Risk assessment summary');

  if (config.reasons) {
    config.reasons.forEach((reasonObj) => {
      expect(RiskAssessmentSummaryPage.reasons).to.match(caseInSensitive(reasonObj.reason));
    });
  }

  expect(RiskAssessmentSummaryPage.completedBy).to.include(officerName);
  expect(RiskAssessmentSummaryPage.completedBy).to.include(assessmentDate);
  expect(RiskAssessmentSummaryPage.prisonerName).to.equalIgnoreCase(config.prisoner.name);
  expect(RiskAssessmentSummaryPage.prisonerDob).to.equalIgnoreCase(config.prisoner.dateOfBirth);
  expect(RiskAssessmentSummaryPage.prisonerNomisId).to.equalIgnoreCase(config.prisoner.nomisId);
  expect(RiskAssessmentSummaryPage.outcome).to.match(caseInSensitive(config.finalRecommendation));
  expect(RiskAssessmentSummaryPage.harm).to.equalIgnoreCase(config.answers.harmCellMate);
  expect(RiskAssessmentSummaryPage.gang).to.equalIgnoreCase(config.answers.gangAffiliation);
  expect(RiskAssessmentSummaryPage.narcotics).to.equalIgnoreCase(config.answers.drugMisuse);
  expect(RiskAssessmentSummaryPage.prejudice).to.equalIgnoreCase(config.answers.prejudice);
  expect(RiskAssessmentSummaryPage.officerComments).to.equalIgnoreCase(config.answers.officersAssessment); // eslint-disable-line max-len

  RiskAssessmentSummaryPage.clickContinue();
};

export const fullAssessmentRecommendation = (config) => {
  if (config.smokeTest) {
    browser.url('/dashboard?displayTestAssessments=true');
  }

  expect(DashboardPage.waitForMainHeadingWithDataId('dashboard')).to.contain('All assessments');

  browser.waitForVisible(`tr[data-element-id="profile-row-${config.prisoner.nomisId}"]`, ELEMENT_SEARCH_TIMEOUT);

  const row = browser.element(`[data-element-id="profile-row-${config.prisoner.nomisId}"]`);

  browser.waitUntil(() => (
    row.getText().toLowerCase() === (`${config.prisoner.name} ${config.prisoner.nomisId} ${config.prisoner.dateOfBirth} Complete Start ${config.finalRecommendation}`).toLowerCase()
  ), ELEMENT_SEARCH_TIMEOUT, 'expected text to be different after 5s');
};

export const thenTheAssessmentIsCompleted = (config = defaultAssessmentConfig) => {
  expect(DashboardPage.waitForMainHeadingWithDataId('dashboard')).to.contain('All assessments');

  if (config.smokeTest) {
    browser.url('/dashboard?displayTestAssessments=true');
  }

  browser.waitForVisible(`tr[data-element-id="profile-row-${config.prisoner.nomisId}"]`, ELEMENT_SEARCH_TIMEOUT);

  const username = browser.getAttribute('[data-header-username]', 'data-header-username');
  const name = browser.getAttribute('[data-header-name]', 'data-header-name');
  const row = browser.element('tbody tr');
  const assessmentId = row.getAttribute('data-assessment-id');

  browser.waitUntil(() => (
    row.getText().toLowerCase() === (`${config.prisoner.name} ${config.prisoner.nomisId} ${config.prisoner.dateOfBirth} Complete Start`).toLowerCase()
  ), ELEMENT_SEARCH_TIMEOUT, 'expected text to be different after 5s');

  expect(assessmentId).to.not.equal(
    undefined,
    'expected to find data-risk-assessment-id on the page',
  );

  if (!config.smokeTest) {
    checkThatRiskAssessmentDataWasWrittenToDatabaseSync({
      id: assessmentId,
      riskAssessment: {
        username,
        name,
        outcome: config.finalRecommendation,
        viperScore: config.viperScore,
        questions: {
          introduction: {
            questionId: 'introduction',
            question: 'Making this process fair and open',
            answer: 'accepted',
          },
          'risk-of-violence': {
            questionId: 'risk-of-violence',
            question: 'Viper result',
            answer: '',
          },
          'harm-cell-mate': {
            questionId: 'harm-cell-mate',
            question: 'Is there any genuine indication they might seriously hurt a cellmate?',
            answer: config.answers.harmCellMate,
            'reasons-for-answer': 'A harmCellMate generic comment',
          },
          'gang-affiliation': {
            questionId: 'gang-affiliation',
            question: 'Are they in a gang?',
            answer: config.answers.gangAffiliation,
          },
          'drug-misuse': {
            questionId: 'drug-misuse',
            question: 'Have they taken illicit drugs in the last month?',
            answer: config.answers.drugMisuse,
          },
          prejudice: {
            questionId: 'prejudice',
            question: 'Do they have any hostile views or prejudices?',
            answer: config.answers.prejudice,
          },
          'officers-assessment': {
            questionId: 'officers-assessment',
            question: 'Are there any other reasons why you would recommend they have a single cell?',
            answer: config.answers.officersAssessment,
          },
        },
        reasons: config.reasons || [],
      },
    });
  }
};


export const andICanViewTheAssessmentAgain = (config = defaultAssessmentConfig) => {
  expect(DashboardPage.waitForMainHeadingWithDataId('dashboard')).to.contain('All assessments');

  DashboardPage.viewCompletedRiskAssessmentFor(config.prisoner.nomisId);

  expect(RiskAssessmentSummaryPage.waitForMainHeadingWithDataId('risk-summary')).to.equal('Risk assessment summary');

  if (config.reasons) {
    config.reasons.forEach((reasonObj) => {
      expect(RiskAssessmentSummaryPage.reasons).to.match(caseInSensitive(reasonObj.reason));
    });
  }

  expect(RiskAssessmentSummaryPage.prisonerName).to.equalIgnoreCase(config.prisoner.name);
  expect(RiskAssessmentSummaryPage.prisonerDob).to.equalIgnoreCase(config.prisoner.dateOfBirth);
  expect(RiskAssessmentSummaryPage.prisonerNomisId).to.equalIgnoreCase(config.prisoner.nomisId);
  expect(RiskAssessmentSummaryPage.outcome).to.match(caseInSensitive(config.finalRecommendation));
  expect(RiskAssessmentSummaryPage.harm).to.equalIgnoreCase(config.answers.harmCellMate);
  expect(RiskAssessmentSummaryPage.gang).to.equalIgnoreCase(config.answers.gangAffiliation);
  expect(RiskAssessmentSummaryPage.narcotics).to.equalIgnoreCase(config.answers.drugMisuse);
  expect(RiskAssessmentSummaryPage.prejudice).to.equalIgnoreCase(config.answers.prejudice);
  expect(RiskAssessmentSummaryPage.officerComments).to.equalIgnoreCase(config.answers.officersAssessment); // eslint-disable-line max-len

  RiskAssessmentSummaryPage.clickContinue();

  expect(DashboardPage.waitForMainHeadingWithDataId('dashboard')).to.contain('All assessments');
};
