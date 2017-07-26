import givenThatTheOfficerIsSignedIn from './tasks/officerSignsIn.task';
import whenTheOfficerAddsThePrisonersDetails from './tasks/theOfficerAddsThePrisonersDetails.task';

import {
  whenPrisonerIsAssessed as whenALowRiskPrisonerIsAssessed,
  thenTheAssessmentIsCompleted as thenTheRiskAssessmentIsCompleted,
} from './helpers/complete-risk-assessment';

import {
  whenAPrisonersHealthcareResultsAreEntered as whenHealthcareRecommendsSharedCell,
  thenTheFullAssessmentIsCompleted,
  viewFullOutcomeForPrisoner as andICanViewTheirAssessmentOutcomeAgain,
} from './helpers/complete-healthcare-assessment';

import config from '../../../server/config';
import db from '../../util/db';


const prisoner = {
  nomisId: 'J1234LO',
  name: 'John Lowe',
  dateOfBirth: '1 October 1970',
};

const healthcareAssessmentConfig = {
  prisoner,
  answers: {
    singleCellRecommendation: 'yes',
  },
  recommendation: 'single cell',
  viperScore: 0.35,
};

const fullAssessmentCompleteConfig = {
  prisoner,
  finalOutcome: 'single cell',
};

describe('Both assessments (Single cell outcome)', () => {
  before(() => {
    if (config.viper.enabled) {
      return Promise.resolve();
    }
    return db.raw("IF NOT EXISTS (SELECT * FROM viper WHERE nomis_id = 'J1234LO') INSERT INTO viper VALUES('J1234LO', 0.35) ELSE UPDATE viper SET rating = 0.35 WHERE nomis_id = 'J1234LO'");
  });

  it('Assesses a low risk prisoner', () => {
    browser.url('/');

    givenThatTheOfficerIsSignedIn();
    whenTheOfficerAddsThePrisonersDetails();
    whenALowRiskPrisonerIsAssessed();
    thenTheRiskAssessmentIsCompleted();
    whenHealthcareRecommendsSharedCell(healthcareAssessmentConfig);
    thenTheFullAssessmentIsCompleted(fullAssessmentCompleteConfig);

    andICanViewTheirAssessmentOutcomeAgain(fullAssessmentCompleteConfig);
  });
});
