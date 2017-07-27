import {
  signIn,
  signOut,
  getRiskAssessmentQuestions,
  getHealthAssessmentQuestions,
  getOffenderAssessments,
  getViperScores,
  addViperScore,
  selectOffender,
  addPrisoner,
  confirmPrisoner,
  saveRiskAssessmentAnswer,
  saveHealthcareAssessmentAnswer,
  completeRiskAssessmentFor,
  completeHealthAssessmentFor,
  completeHealthAnswersFor,
  storeOutcome,
} from '../../../../client/javascript/actions';

import riskAssessmentQuestions
from '../../../../client/javascript/fixtures/risk-assessment-questions.json';
import healthcareQuestions
from '../../../../client/javascript/fixtures/healthcare-questions.json';

describe('Actions', () => {
  describe('#getRiskAssessmentQuestions', () => {
    it('return a GET_RISK_ASSESSMENT_QUESTIONS action', () => {
      expect(getRiskAssessmentQuestions(riskAssessmentQuestions)).to.eql({
        type: 'GET_RISK_ASSESSMENT_QUESTIONS',
        payload: riskAssessmentQuestions,
      });
    });
  });

  describe('#getHealthAssessmentQuestions', () => {
    it('return a GET_HEALTH_ASSESSMENT_QUESTIONS action', () => {
      expect(getHealthAssessmentQuestions(healthcareQuestions)).to.eql({
        type: 'GET_HEALTH_ASSESSMENT_QUESTIONS',
        payload: healthcareQuestions,
      });
    });
  });

  describe('#getOffenderAssessments', () => {
    it('return a GET_OFFENDER_ASSESSMENTS action', () => {
      const assessments = [{
        id: 1,
        nomisId: 'foo-id',
        surname: 'foo-surname',
        forename: 'foo-first-name',
        dateOfBirth: '1-12-2010',
        riskAssessmentCompleted: true,
        healthAssessmentCompleted: true,
        outcome: 'Foo outcome',
      }];

      expect(getOffenderAssessments(assessments)).to.eql({
        type: 'GET_OFFENDER_ASSESSMENTS',
        payload: assessments,
      });
    });
  });

  describe('#getViperScores', () => {
    it('returns a GET_VIPER_SCORES action', () => {
      const scores = {
        output: [{
          nomisId: 'FOO',
          viperScore: 1,
        }],
      };
      expect(getViperScores(scores)).to.eql({
        type: 'GET_VIPER_SCORES',
        payload: scores.output,
      });
    });
  });

  describe('#addViperScore', () => {
    it('returns a ADD_VIPER_SCORE action', () => {
      const score = {
        nomisId: 'FOO',
        viperScore: 1,
      };
      expect(addViperScore(score)).to.eql({
        type: 'ADD_VIPER_SCORE',
        payload: score,
      });
    });
  });

  describe('#selectOffender', () => {
    it('returns a SELECT_OFFENDER action', () => {
      const offender = {
        nomisId: 'foo',
        surname: 'foobar',
        forename: 'foobaz',
        dateOfBirth: 'foo-age',
      };

      expect(selectOffender(offender)).to.eql({
        type: 'SELECT_OFFENDER',
        payload: offender,
      });
    });
  });

  describe('#signIn', () => {
    it('returns a SIGN_IN action', () => {
      const user = 'Foo bar';
      expect(signIn(user)).to.eql({
        type: 'SIGN_IN',
        payload: user,
      });
    });
  });

  describe('#signOut', () => {
    it('returns a SIGN_OUT action', () => {
      expect(signOut()).to.eql({
        type: 'SIGN_OUT',
      });
    });
  });

  describe('#addPrisoner', () => {
    it('returns a ADD_PRISONER action', () => {
      const prisoner = {
        'first-name': 'foo',
        'last-name': 'bar',
        'dob-day': '01',
        'dob-month': '10',
        'dob-year': '1997',
        'nomis-id': 'AA12345',
      };

      expect(addPrisoner(prisoner)).to.eql({
        type: 'ADD_PRISONER',
        payload: prisoner,
      });
    });
  });

  describe('#confirmPrisoner', () => {
    it('returns a CONFIRM_PRISONER action', () => {
      const prisonerData = {
        'first-name': 'foo',
        'last-name': 'bar',
        'dob-day': '01',
        'dob-month': '10',
        'dob-year': '1997',
        'nomis-id': 'AA12345',
      };

      const prisoner = {
        nomisId: 'AA12345',
        surname: 'bar',
        forename: 'foo',
        dateOfBirth: '01-10-1997',
      };

      expect(confirmPrisoner(prisonerData)).to.eql({
        type: 'CONFIRM_PRISONER',
        payload: prisoner,
      });
    });
  });

  describe('#saveRiskAssessmentAnswer', () => {
    it('returns a SAVE_RISK_ASSESSMENT_ANSWER action', () => {
      const section = 'foo-risk';
      const answer = {
        confirmation: 'accept',
      };

      expect(saveRiskAssessmentAnswer(section, answer)).to.eql({
        type: 'SAVE_RISK_ASSESSMENT_ANSWER',
        payload: {
          [section]: answer,
        },
      });
    });
  });

  describe('#saveHealthcareAssessmentAnswer', () => {
    it('returns a SAVE_HEALTHCARE_ANSWER action', () => {
      const section = 'foo-risk';
      const answer = {
        confirmation: 'accept',
      };

      expect(saveHealthcareAssessmentAnswer(section, answer)).to.eql({
        type: 'SAVE_HEALTHCARE_ANSWER',
        payload: {
          [section]: answer,
        },
      });
    });
  });

  describe('#completeRiskAssessmentFor', () => {
    it('returns a COMPLETE_RISK_ASSESSMENT action', () => {
      const outcome = {
        nomisId: 'foo-id',
        recommendation: 'foo-outccome',
        reasons: ['foo-reason'],
        assessmentId: 'foo-nomis-id',
        rating: 'foo-rating',
      };
      expect(completeRiskAssessmentFor(outcome)).to.eql({
        type: 'COMPLETE_RISK_ASSESSMENT',
        payload: outcome,
      });
    });
  });

  describe('#completeHealthAssessmentFor', () => {
    it('returns a COMPLETE_HEALTH_ASSESSMENT action', () => {
      const outcome = {
        nomisId: 'foo-id',
        recommendation: 'foo-recommendation',
        assessmentId: 'foo-nomis-id',
      };
      expect(completeHealthAssessmentFor(outcome)).to.eql({
        type: 'COMPLETE_HEALTH_ASSESSMENT',
        payload: outcome,
      });
    });
  });

  describe('#completeHealthAnswersFor', () => {
    it('returns a HEALTHCARE_ANSWERS_COMPLETE action', () => {
      const offender = {
        nomisId: 'foo-nomis-id',
      };
      expect(completeHealthAnswersFor(offender)).to.eql({
        type: 'HEALTHCARE_ANSWERS_COMPLETE',
        payload: offender,
      });
    });
  });

  describe('#storeOutcome', () => {
    it('returns a SAVE_OUTCOME action', () => {
      const outcome = {
        nomisId: 'foo-nomis-id',
        outcome: 'foo-outcome',
      };
      expect(storeOutcome(outcome)).to.eql({
        type: 'SAVE_OUTCOME',
        payload: outcome,
      });
    });
  });
});
