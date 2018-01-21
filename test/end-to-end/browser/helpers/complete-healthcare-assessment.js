import { ELEMENT_SEARCH_TIMEOUT } from '../../constants';
import HealthcareOutcomePage from '../pages/healthcare/HealthcareOutcome.page';
import HealthcareCommentsPage from '../pages/healthcare/HealthcareComments.page';
import HealthcareConsentPage from '../pages/healthcare/HealthcareConsent.page';
import HealthcareNursePage from '../pages/healthcare/HealthcareNurse.page';
import DashboardPage from '../pages/Dashboard.page';
import HealthcareSummary from '../pages/healthcare/HealthcareSummary.page';

import { checkThatHealthAssessmentDataWasWrittenToDatabaseSync } from '../../utils/dbAssertions';

const defaultAssessmentConfig = {
  prisoner: {
    nomisId: 'A1401AE',
    name: 'Jilly Hall',
    dateOfBirth: '1 January 1970',
  },
  answers: {
    singleCellRecommendation: 'no',
  },
  recommendation: 'shared cell',
  viperScore: 0.35,
};


const selectYesNoAnswer = (answer) => {
  if (answer === 'yes') {
    HealthcareOutcomePage.clickYesAndContinue();
  } else {
    HealthcareOutcomePage.clickNoAndContinue();
  }
};

const caseInSensitive = text => new RegExp(text, 'i');

const whenAPrisonersHealthcareResultsAreEntered = (config = defaultAssessmentConfig) => {
  if (config.smokeTest) {
    browser.url('/dashboard?displayTestAssessments=true');
  }

  expect(DashboardPage.waitForMainHeadingWithDataId('dashboard')).to.contain('All assessments');

  DashboardPage.startHealthcareAssessmentFor(config.prisoner.nomisId);

  expect(HealthcareOutcomePage.waitForMainHeadingWithDataId('outcome')).to.contain('Does healthcare recommend a single cell?');
  selectYesNoAnswer(config.answers.singleCellRecommendation);

  expect(HealthcareCommentsPage.waitForMainHeadingWithDataId('comments')).to.contain('Enter all the comments on the healthcare form');
  HealthcareCommentsPage.commentAndContinue('a healthcare comment');

  expect(HealthcareConsentPage.waitForMainHeadingWithDataId('consent')).to.contain('Have they given consent to share their medical information?');
  HealthcareConsentPage.clickNoAndContinue();

  expect(HealthcareNursePage.waitForMainHeadingWithDataId('assessor')).to.contain('Who completed the healthcare assessment?');
  HealthcareNursePage.enterRole('Nurse');
  HealthcareNursePage.enterName('Jane Doe');
  HealthcareNursePage.enterDate('21', '07', '2017');
  HealthcareNursePage.clickContinue();

  expect(HealthcareSummary.waitForMainHeadingWithDataId('healthcare-summary')).to.equal('Healthcare assessment summary');
  expect(HealthcareSummary.prisonerName).to.equalIgnoreCase(config.prisoner.name);
  expect(HealthcareSummary.prisonerDob).to.equalIgnoreCase(config.prisoner.dateOfBirth);
  expect(HealthcareSummary.prisonerNomisId).to.equalIgnoreCase(config.prisoner.nomisId);

  // expect(HealthcareSummary.outcome).to.match(caseInSensitive(config.recommendation));

  browser.waitUntil(() => HealthcareSummary.outcome.toLowerCase().includes(config.recommendation), ELEMENT_SEARCH_TIMEOUT, 'expected text to be different after 5s');

  expect(HealthcareSummary.assessor).to.equalIgnoreCase('Jane Doe');
  expect(HealthcareSummary.role).to.equalIgnoreCase('nurse');
  expect(HealthcareSummary.date).to.equalIgnoreCase('21 July 2017');
  expect(HealthcareSummary.recommendation).to.equalIgnoreCase(config.answers.singleCellRecommendation); // eslint-disable-line max-len
  expect(HealthcareSummary.comments).to.equalIgnoreCase('a healthcare comment');
  expect(HealthcareSummary.consent).to.equalIgnoreCase('no');

  HealthcareSummary.clickChange();
  HealthcareConsentPage.clickYesAndContinue();
  expect(HealthcareSummary.consent).to.equalIgnoreCase('yes');
};

const thenTheHealthcareAssessmentIsComplete = (config = defaultAssessmentConfig) => {
  HealthcareSummary.clickContinue();

  DashboardPage.waitForMainHeadingWithDataId('dashboard');

  const row = browser.element(`[data-element-id="profile-row-${config.prisoner.nomisId}"]`);
  const username = browser.getAttribute('[data-header-username]', 'data-header-username');
  const name = browser.getAttribute('[data-header-name]', 'data-header-name');


  browser.waitUntil(() => (
    row.getText().toLowerCase() === (`${config.prisoner.name} ${config.prisoner.nomisId} ${config.prisoner.dateOfBirth} Start Complete`).toLowerCase()
  ), ELEMENT_SEARCH_TIMEOUT, 'expected text to be different after 5s');

  const assessmentId = row.getAttribute('data-assessment-id');

  checkThatHealthAssessmentDataWasWrittenToDatabaseSync({
    id: assessmentId,
    healthAssessment: {
      username,
      name,
      viperScore: null,
      questions: {
        outcome: {
          questionId: 'outcome',
          question: 'Does healthcare recommend a single cell?',
          answer: 'no',
        },
        comments: {
          questionId: 'comments',
          question: 'Enter all the comments on the healthcare form',
          answer: 'a healthcare comment',
        },
        consent: {
          questionId: 'consent',
          question: 'Have they given consent to share their medical information?',
          answer: 'yes',
        },
        assessor: {
          questionId: 'assessor',
          question: 'Who completed the healthcare assessment?',
          answer: 'Nurse, Jane Doe, 21-07-2017',
        },
      },
      outcome: 'shared cell',
    },
  });
};

const andICanViewTheAssessmentAgain = (config = defaultAssessmentConfig) => {
  expect(DashboardPage.waitForMainHeadingWithDataId('dashboard')).to.contain('All assessments');

  DashboardPage.viewCompletedHealthcareAssessmentFor(config.prisoner.nomisId);

  expect(HealthcareSummary.waitForMainHeadingWithDataId('healthcare-summary')).to.equal('Healthcare assessment summary');
  expect(HealthcareSummary.prisonerName).to.equalIgnoreCase(config.prisoner.name);
  expect(HealthcareSummary.prisonerDob).to.equalIgnoreCase(config.prisoner.dateOfBirth);
  expect(HealthcareSummary.prisonerNomisId).to.equalIgnoreCase(config.prisoner.nomisId);

  expect(HealthcareSummary.outcome).to.match(caseInSensitive(config.recommendation));

  expect(HealthcareSummary.assessor).to.equalIgnoreCase('Jane Doe');
  expect(HealthcareSummary.role).to.equalIgnoreCase('nurse');
  expect(HealthcareSummary.date).to.equalIgnoreCase('21 July 2017');
  expect(HealthcareSummary.recommendation).to.equalIgnoreCase(config.answers.singleCellRecommendation); // eslint-disable-line max-len
  expect(HealthcareSummary.comments).to.equalIgnoreCase('a healthcare comment');
  expect(HealthcareSummary.consent).to.equalIgnoreCase('yes');

  HealthcareSummary.clickContinue();

  expect(DashboardPage.waitForMainHeadingWithDataId('dashboard')).to.contain('All assessments');
};

export {
  whenAPrisonersHealthcareResultsAreEntered,
  thenTheHealthcareAssessmentIsComplete,
  andICanViewTheAssessmentAgain,
};
