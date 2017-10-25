import uuid from 'uuid/v4';
import randomName from 'random-name';
import toUpper from 'ramda/src/toUpper';

import { ELEMENT_SEARCH_TIMEOUT } from '../constants';

import givenThatTheOfficerIsSignedIn from '../browser/tasks/officerSignsIn.task';
import whenTheOfficerAddsThePrisonersDetails from '../browser/tasks/theOfficerAddsThePrisonersDetails.task';
import {
  whenPrisonerIsAssessed,
  thenTheAssessmentIsCompleted as thenTheRiskAssessmentIsCompleted,
} from '../browser/helpers/complete-risk-assessment';

import {
  whenAPrisonersHealthcareResultsAreEntered as whenHealthcareRecommendsSharedCell,
} from '../browser/helpers/complete-healthcare-assessment';

import {
  thenTheFullAssessmentIsCompleted,
  viewFullOutcomeForPrisoner as andICanViewTheirAssessmentOutcomeAgain,
} from '../browser/helpers/complete-full-assessment';

const uniqueTestNomisId = toUpper(`test${uuid().substring(0, 4)}`);
const forename = randomName.first();
const surname = randomName.last();

const prisoner = {
  forename,
  surname,
  dob: {
    day: 3,
    month: 12,
    year: 1958,
  },
  nomisId: uniqueTestNomisId,
  dateOfBirth: '3 December 1958',
};

const prisonerShort = {
  nomisId: uniqueTestNomisId,
  name: `${forename} ${surname}`,
  dateOfBirth: '03 December 1958',
};

const assessmentConfig = {
  smokeTest: true,
  prisoner: prisonerShort,
  viperScore: null,
  initialRecommendation: 'No predictor data available',
  finalRecommendation: 'single cell',
  answers: {
    harmCellMate: 'yes',
    gangAffiliation: 'no',
    drugMisuse: 'no',
    prejudice: 'no',
    officersAssessment: 'no',
  },
  reasons: [
    { questionId: 'harmCellMate', reason: 'Officer thinks they might seriously hurt cellmate' },
  ],
};

const healthcareAssessmentConfig = {
  smokeTest: true,
  prisoner: prisonerShort,
  answers: {
    singleCellRecommendation: 'yes',
  },
  recommendation: 'single cell',
  viperScore: null,
};

const fullAssessmentCompleteConfig = {
  smokeTest: true,
  prisoner: prisonerShort,
  finalOutcome: 'single cell',
};

const selector = `[data-element-id="profile-row-${uniqueTestNomisId}"]`;

describe('Smoke test for prod', () => {
  // eslint-disable-next-line
  before(function () {
    givenThatTheOfficerIsSignedIn({ smokeTest: true });
    whenTheOfficerAddsThePrisonersDetails({ prisoner, smokeTest: true });
  });

  context('when the `displayTestAssessments` queryString is absent', () => {
    it('does not display the test user', () => {
      browser.url('/dashboard');

      expect(() => browser.waitForVisible(selector, ELEMENT_SEARCH_TIMEOUT)).to.throw();
    });
  });


  context('when the `displayTestAssessments` queryString is present', () => {
    it('displays the test user', () => {
      browser.url('/dashboard?displayTestAssessments=true');
      browser.waitForVisible(selector, ELEMENT_SEARCH_TIMEOUT);
      expect(browser.isVisible(selector)).to.equal(true);
    });

    it('assess a the prisoner', () => {
      whenPrisonerIsAssessed(assessmentConfig);
      thenTheRiskAssessmentIsCompleted(assessmentConfig);
      whenHealthcareRecommendsSharedCell(healthcareAssessmentConfig);
      thenTheFullAssessmentIsCompleted(fullAssessmentCompleteConfig);
      andICanViewTheirAssessmentOutcomeAgain(fullAssessmentCompleteConfig);
    });
  });
});
