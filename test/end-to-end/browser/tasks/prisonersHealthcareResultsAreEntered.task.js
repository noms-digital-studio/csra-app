import HealthcareOutcomePage from '../pages/healthcare/HealthcareOutcome.page';
import HealthcareCommentsPage
  from '../pages/healthcare/HealthcareComments.page';
import HealthcareConsentPage from '../pages/healthcare/HealthcareConsent.page';
import HealthcareNursePage from '../pages/healthcare/HealthcareNurse.page';
import DashboardPage from '../pages/Dashboard.page';
import HealthcareSummary from '../pages/healthcare/HealthcareSummary.page';

import checkThatAssessmentDataWasWrittenToDatabase from '../../utils/dbAssertions';

function aPrisonersHealthcareResultsAreEntered(singleCellRecommended) {
  DashboardPage.clickHealthcareStartLinkForNomisId('J1234LO');
  expect(HealthcareOutcomePage.mainHeading).to.contain(
    'Does healthcare recommend a single cell?',
  );

  if (singleCellRecommended) {
    HealthcareOutcomePage.clickYesAndContinue();
  } else {
    HealthcareOutcomePage.clickNoAndContinue();
  }
  expect(HealthcareCommentsPage.mainHeading).to.contain(
    'Enter all the comments on the healthcare form',
  );

  HealthcareCommentsPage.commentAndContinue('a healthcare comment');
  expect(HealthcareConsentPage.mainHeading).to.contain(
    'Have they given consent to share their medical information?',
  );

  HealthcareConsentPage.clickNoAndContinue();
  expect(HealthcareNursePage.mainHeading).to.contain(
    'Who completed the healthcare assessment?',
  );
  HealthcareNursePage.enterRole('Nurse');
  HealthcareNursePage.enterName('Jane Doe');
  HealthcareNursePage.enterDate('21', '07', '2017');
  HealthcareNursePage.clickContinue();
  expect(HealthcareSummary.mainHeading).to.equal('Healthcare summary');
  expect(HealthcareSummary.name).to.equalIgnoreCase('John Lowe');
  expect(HealthcareSummary.dob).to.equalIgnoreCase('01-10-1970');
  expect(HealthcareSummary.nomisId).to.equalIgnoreCase('J1234LO');
  expect(HealthcareSummary.assessor).to.equalIgnoreCase('Jane Doe');
  expect(HealthcareSummary.role).to.equalIgnoreCase('nurse');
  expect(HealthcareSummary.date).to.equalIgnoreCase('21-07-2017');
  expect(HealthcareSummary.outcome).to.equalIgnoreCase(
    singleCellRecommended ? 'single cell' : 'shared cell',
  );
  expect(HealthcareSummary.comments).to.equalIgnoreCase('a healthcare comment');
  expect(HealthcareSummary.consent).to.equalIgnoreCase('no');

  HealthcareSummary.clickChange();
  HealthcareConsentPage.clickYesAndContinue();
  expect(HealthcareSummary.consent).to.equalIgnoreCase('yes');
}

function thenTheHealthcareAssessmentIsComplete({ sharedText }) {
  HealthcareSummary.submitForm();
  expect(DashboardPage.waitForMainHeadingWithDataId('dashboard')).to.contain(
    'Assessments on:',
  );

  const row = browser.element('[data-profile-row=J1234LO]');
  expect(row.getText()).to.equal(
    'John Lowe J1234LO 01-10-1970 Start Complete',
  );

  const assessmentId = row.getAttribute('data-health-assessment-id');

  return checkThatAssessmentDataWasWrittenToDatabase({
    nomisId: 'J1234LO',
    assessmentId,
    assessmentType: 'healthcare',
    questionData: {
      outcome: {
        question_id: 'outcome',
        question: 'Does healthcare recommend a single cell?',
        answer: 'no',
      },
      comments: {
        question_id: 'comments',
        question: 'Enter all the comments on the healthcare form',
        answer: 'a healthcare comment',
      },
      consent: {
        question_id: 'consent',
        question: 'Have they given consent to share their medical information?',
        answer: 'yes',
      },
      assessor: {
        question_id: 'assessor',
        question: 'Who completed the healthcare assessment?',
        answer: 'Nurse, Jane Doe, 21-07-2017',
      },
    },
    sharedText,
  });
}

function whenHealthcareRecommendsSingleCell() {
  aPrisonersHealthcareResultsAreEntered(true);
}

function whenHealthcareRecommendsSharedCell() {
  aPrisonersHealthcareResultsAreEntered(false);
}

export {
  thenTheHealthcareAssessmentIsComplete,
  whenHealthcareRecommendsSingleCell,
  whenHealthcareRecommendsSharedCell,
};
