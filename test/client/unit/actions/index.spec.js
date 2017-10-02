import {
  getRiskAssessmentQuestions,
  getHealthAssessmentQuestions,
  getOffenderAssessments,
  selectOffender,
  addPrisoner,
  confirmPrisoner,
  completeHealthAnswersFor,
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
        forename: 'foo-forename',
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

  describe('#selectOffender', () => {
    it('returns a SELECT_OFFENDER action', () => {
      const offender = {
        assessmentId: 1,
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

  describe('#addPrisoner', () => {
    it('returns a ADD_PRISONER action', () => {
      const prisoner = {
        forename: 'foo',
        surname: 'bar',
        'dob-day': '01',
        'dob-month': '10',
        'dob-year': '1997',
        nomisId: 'AA12345',
      };

      expect(addPrisoner(prisoner)).to.eql({
        type: 'ADD_PRISONER',
        payload: prisoner,
      });
    });
  });

  describe('#confirmPrisoner', () => {
    it('returns a CONFIRM_PRISONER action', () => {
      expect(confirmPrisoner()).to.eql({ type: 'CONFIRM_PRISONER' });
    });
  });

  describe('#completeHealthAnswersFor', () => {
    it('returns a HEALTHCARE_ANSWERS_COMPLETE action', () => {
      const offender = {
        assessmentId: 1,
      };
      expect(completeHealthAnswersFor(offender)).to.eql({
        type: 'HEALTHCARE_ANSWERS_COMPLETE',
        payload: offender,
      });
    });
  });
});
