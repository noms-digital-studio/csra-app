import request from 'supertest';
import { expect } from 'chai';

const baseUrl = process.env.APP_BASE_URL;

const riskAssessment = {
  nomis_id: 'AS223213',
  type: 'risk',
  outcome: 'single',
  viper: 0.123,
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
  nomis_id: 'AS223213',
  type: 'healthcare',
  outcome: 'single',
  viper: 0.123,
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
    request(baseUrl)
      .post('/api/assessment')
      .send(riskAssessment)
      .expect(200)
      .then((res) => {
        expect(res.body.status).to.equal('OK');
        expect(res.body.data)
          .to.have.property('id')
          .which.is.a('number');
      }),
  );
  it('records a health assessment', () =>
    request(baseUrl)
      .post('/api/assessment')
      .send(healthcareAssessment)
      .expect(200)
      .then((res) => {
        expect(res.body.status).to.equal('OK');
        expect(res.body.data)
          .to.have.property('id')
          .which.is.a('number');
      }),
  );
  it.skip('rejects an invalid assessment', () =>
    request(baseUrl)
      .post('/api/assessment')
      .send({ some: 'junk' })
      .expect(400)
      .then((res) => {
        expect(res.body.status).to.equal('ERROR');
        expect(res.body).to.have.property('error');
      }),
  );
});

