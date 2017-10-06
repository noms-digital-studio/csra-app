/* eslint-disable prefer-arrow-callback */
import request from 'supertest';
import uuid from 'uuid/v4';
import { checkThatPrisonerAssessmentDataWasWrittenToDatabase,
         checkThatRiskAssessmentDataWasWrittenToDatabase,
         checkThatHealthAssessmentDataWasWrittenToDatabase,
         checkThatTheOutcomeDataWasWrittenToDatabase } from '../utils/dbAssertions';

import db from '../../util/db';

const timeoutDuration = 25000;

function generateNomisId() {
  const nomisId = uuid().substring(0, 8);
  return nomisId.toUpperCase();
}

const agent = request.agent(process.env.APP_BASE_URL);

async function primeDatabase({
  nomisId, riskAssessment = null,
  healthAssessment = null, outcome = null,
}) {
  const result = await db.insert({
    nomis_id: nomisId,
    forename: 'assessmentService',
    surname: 'test',
    date_of_birth: new Date(),
    git_date: new Date(),
    questions_hash: 'hash',
    git_version: 'git_version',
    risk_assessment: riskAssessment,
    health_assessment: healthAssessment,
    outcome,
  }).into('prisoner_assessments').returning('id');

  return { id: result[0] };
}

describe('/api/assessments/', () => {
  const nomisId = generateNomisId();

  before(() => agent.post('/signin').send('username=officer&password=password')
    .expect(302).expect((res) => {
      expect(res.headers.location).to.eql('/');
    }));

  it('saves the prisoner data', async function test() {
    this.timeout(timeoutDuration);
    const result = await agent.post('/api/assessments/').send({
      nomisId,
      forename: 'assessmentService',
      surname: 'test',
      dateOfBirth: 599529600,
    }).expect(201);
    expect(result.body).to.have.property('id');

    await checkThatPrisonerAssessmentDataWasWrittenToDatabase({
      id: result.body.id,
      nomisId,
      forename: 'assessmentService',
      surname: 'test',
      dateOfBirth: 'Sat Dec 31 1988',
    });
  });

  it('retrieves the prisoner assessments list', async function test() {
    this.timeout(timeoutDuration);
    await primeDatabase({ nomisId });

    const result = await agent.get('/api/assessments/').expect(200);

    const prisonerAssessment = result.body[0];
    expect(prisonerAssessment.nomisId).to.equal(nomisId);
    expect(prisonerAssessment.forename).to.equal('assessmentService');
    expect(prisonerAssessment.surname).to.equal('test');
    expect(prisonerAssessment.riskAssessmentCompleted).to.equal(false);
    expect(prisonerAssessment.healthAssessmentCompleted).to.equal(false);
    expect(prisonerAssessment.outcome).to.equal(null);
    expect(prisonerAssessment).to.have.property('dateOfBirth');
  });

  it('saves the risk assessment', async function test() {
    this.timeout(timeoutDuration);
    const result = await primeDatabase({ nomisId });
    const id = result.id;

    await agent.put(`/api/assessments/${id}/risk`).send(
      {
        outcome: 'single cell',
        viperScore: 0.35,
        questions: { Q1: { questionId: 'Q1', question: 'Example question text?', answer: 'Yes' } },
        reasons: [{ questionId: 'Q1', reason: 'Example reason text' }],
      }).expect(200);

    await checkThatRiskAssessmentDataWasWrittenToDatabase({
      id,
      riskAssessment: {
        outcome: 'single cell',
        viperScore: 0.35,
        questions: { Q1: { questionId: 'Q1', question: 'Example question text?', answer: 'Yes' } },
        reasons: [{ questionId: 'Q1', reason: 'Example reason text' }],
      },
    });
  });

  it('retrieves a risk assessment', async function test() {
    this.timeout(timeoutDuration);
    const dbResult = await primeDatabase({ nomisId,
      riskAssessment: JSON.stringify({ outcome: 'single cell', viperScore: 0.35, questions: { Q1: { questionId: 'Q1', question: 'Example question text?', answer: 'Yes' } }, reasons: [{ questionId: 'Q1', reason: 'Example reason text' }] }) });
    const id = dbResult.id;

    const result = await agent.get(`/api/assessments/${id}/risk`).expect(200);

    expect(result.body).to.equal('{"outcome":"single cell","viperScore":0.35,"questions":{"Q1":{"questionId":"Q1","question":"Example question text?","answer":"Yes"}},"reasons":[{"questionId":"Q1","reason":"Example reason text"}]}');
  });

  it('saves the health assessment', async function test() {
    this.timeout(timeoutDuration);
    const result = await primeDatabase({ nomisId });
    const id = result.id;

    await agent.put(`/api/assessments/${id}/health`).send(
      {
        outcome: 'single cell',
        viperScore: 0.35,
        questions: { Q1: { questionId: 'Q1', question: 'Example question text?', answer: 'Yes' } },
      }).expect(200);

    await checkThatHealthAssessmentDataWasWrittenToDatabase({
      id,
      healthAssessment: {
        outcome: 'single cell',
        viperScore: 0.35,
        questions: { Q1: { questionId: 'Q1', question: 'Example question text?', answer: 'Yes' } },
      },
    });
  });

  it('retrieves a health assessment', async function test() {
    this.timeout(timeoutDuration);
    const dbResult = await primeDatabase({ nomisId,
      healthAssessment: JSON.stringify({ outcome: 'single cell', viperScore: 0.35, questions: { Q1: { questionId: 'Q1', question: 'Example question text?', answer: 'Yes' } }, reasons: [{ questionId: 'Q1', reason: 'Example reason text' }] }) });
    const id = dbResult.id;

    const result = await agent.get(`/api/assessments/${id}/health`).expect(200);

    expect(result.body).to.equal('{"outcome":"single cell","viperScore":0.35,"questions":{"Q1":{"questionId":"Q1","question":"Example question text?","answer":"Yes"}},"reasons":[{"questionId":"Q1","reason":"Example reason text"}]}');
  });

  it('saves the outcome', async function test() {
    this.timeout(timeoutDuration);
    const result = await primeDatabase({ nomisId });
    const id = result.id;

    await agent.put(`/api/assessments/${id}/outcome`).send({ outcome: 'single cell' }).expect(200);

    await checkThatTheOutcomeDataWasWrittenToDatabase({ id, outcome: 'single cell' });
  });

  it('retrieves a health assessment', async function test() {
    this.timeout(timeoutDuration);
    const dbResult = await primeDatabase({ nomisId, outcome: 'shared cell' });
    const id = dbResult.id;

    const result = await agent.get(`/api/assessments/${id}`).expect(200);

    expect(result.body.outcome).to.equal('shared cell');
    expect(result.body.nomisId).to.equal(nomisId);
    expect(result.body.forename).to.equal('assessmentService');
    expect(result.body.surname).to.equal('test');
    expect(result.body).to.have.property('dateOfBirth');
  });
});
