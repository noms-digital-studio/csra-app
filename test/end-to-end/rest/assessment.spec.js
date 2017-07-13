import request from 'supertest';
import checkThatAssessmentDataWasWrittenToDatabase from '../utils/dbAssertions';

const baseUrl = process.env.APP_BASE_URL;

const riskAssessment = {
  nomisId: 'AS223213',
  type: 'risk',
  outcome: 'single cell',
  viperScore: 0.35,
  questions: {
    Q1: {
      question_id: 'Q1',
      question: 'Are you legit?',
      answer: 'Yep',
    },
  },
  reasons: [
    {
      question_id: 'Q1',
      reason: 'They said they were legit',
    },
  ],
};

const healthcareAssessment = {
  nomisId: 'AS223213',
  type: 'healthcare',
  outcome: 'single cell',
  viperScore: 0.35,
  questions: {
    Q1: {
      question_id: 'Q1',
      question: 'Are you legit?',
      answer: 'Yep',
    },
  },
  reasons: [
    {
      question_id: 'Q1',
      reason: 'They said they were legit',
    },
  ],
};

describe('POST /api/assessment', function block() {
  this.timeout(5000);

  it('records a risk assessment', () =>
    new Promise((resolve, reject) => {
      request(baseUrl)
        .post('/api/assessment')
        .send(riskAssessment)
        .expect(200)
        .then((res) => {
          expect(res.body.status).to.equal('OK');
          expect(res.body.data).to.have.property('id').which.is.a('number');
          return res;
        })
        .then((res) => {
          const assessmentId = res.body.data.id;
          checkThatAssessmentDataWasWrittenToDatabase({
            nomisId: riskAssessment.nomisId,
            assessmentId,
            questionData: riskAssessment.questions,
            reasons: riskAssessment.reasons,
            sharedText: riskAssessment.outcome,
          })
            .then(resolve)
            .catch(reject);
        })
        .catch(reject);
    }));

  it('records a health assessment', () =>
    new Promise((resolve, reject) => {
      request(baseUrl)
        .post('/api/assessment')
        .send(healthcareAssessment)
        .expect(200)
        .then((res) => {
          expect(res.body.status).to.equal('OK');
          expect(res.body.data).to.have.property('id').which.is.a('number');
          return res;
        })
        .then((res) => {
          const assessmentId = res.body.data.id;
          checkThatAssessmentDataWasWrittenToDatabase({
            nomisId: healthcareAssessment.nomisId,
            assessmentType: healthcareAssessment.type,
            assessmentId,
            questionData: healthcareAssessment.questions,
            reasons: healthcareAssessment.reasons,
            sharedText: healthcareAssessment.outcome,
          })
            .then(resolve)
            .catch(reject);
        })
        .catch(reject);
    }));

  it('rejects an invalid assessment', () =>
    request(baseUrl)
      .post('/api/assessment')
      .send({ some: 'junk' })
      .expect(400)
      .then((res) => {
        expect(res.body.status).to.equal('ERROR');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.have.property('code', 'validation');
      }));
});
