/* eslint-disable prefer-arrow-callback */
import request from 'supertest';
import uuid from 'uuid/v4';
import { checkThatPrisonerAssessmentDataWasWrittenToDatabase,
         checkThatRiskAssessmentDataWasWrittenToDatabase,
         checkThatHealthAssessmentDataWasWrittenToDatabase,
         checkThatTheOutcomeDataWasWrittenToDatabase } from '../utils/dbAssertions';

import db from '../../util/db';

const baseUrl = process.env.APP_BASE_URL;
const timeoutDuration = 25000;

function generateNomisId() {
  const nomisId = uuid().substring(0, 8);
  return nomisId.toUpperCase();
}

function primeDatabase(nomisId, riskAssessment, healthAssessment, outcome) {
  return db
  .insert({
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
  })
  .into('prisoner_assessments')
  .returning('id')
  .then(result => ({ id: result[0] }));
}
describe('/api/assessments/', () => {
  const nomisId = generateNomisId();

  before(function beforeTests() {
    this.timeout(timeoutDuration);
  });

  it('saves the prisoner data', async function test() {
    const result = await request(baseUrl).post('/api/assessments/').send({
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
      dateOfBirth: 'Sat Dec 31 1988 00:00:00 GMT+0000 (GMT)',
    });
  });

  it('retrieves the prisoner assessments list', async function test() {
    await primeDatabase(nomisId, null, null);

    const result = await request(baseUrl).get('/api/assessments/').expect(200);

    expect(result.body[0].nomisId).to.equal(nomisId);
    expect(result.body[0].forename).to.equal('assessmentService');
    expect(result.body[0].surname).to.equal('test');
    expect(result.body[0].riskAssessmentCompleted).to.equal(false);
    expect(result.body[0].healthAssessmentCompleted).to.equal(false);
    expect(result.body[0].outcome).to.equal(null);
    expect(result.body[0]).to.have.property('dateOfBirth');
  });

  it('saves the risk assessment', async function test() {
    const result = await primeDatabase(nomisId, null, null);
    const id = result.id;

    await request(baseUrl).put(`/api/assessments/${id}/risk`).send(
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
    const dbResult = await primeDatabase(nomisId, JSON.stringify({ outcome: 'single cell', viperScore: 0.35, questions: { Q1: { questionId: 'Q1', question: 'Example question text?', answer: 'Yes' } }, reasons: [{ questionId: 'Q1', reason: 'Example reason text' }] }), null);
    const id = dbResult.id;

    const result = await request(baseUrl).get(`/api/assessments/${id}/risk`).expect(200);

    expect(result.body).to.equal('{"outcome":"single cell","viperScore":0.35,"questions":{"Q1":{"questionId":"Q1","question":"Example question text?","answer":"Yes"}},"reasons":[{"questionId":"Q1","reason":"Example reason text"}]}');
  });

  it('saves the health assessment', async function test() {
    const result = await primeDatabase(nomisId, null, null);
    const id = result.id;

    await request(baseUrl).put(`/api/assessments/${id}/health`).send(
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
    const dbResult = await primeDatabase(nomisId, null, JSON.stringify({ outcome: 'single cell', viperScore: 0.35, questions: { Q1: { questionId: 'Q1', question: 'Example question text?', answer: 'Yes' } }, reasons: [{ questionId: 'Q1', reason: 'Example reason text' }] }));
    const id = dbResult.id;

    const result = await request(baseUrl).get(`/api/assessments/${id}/health`).expect(200);

    expect(result.body).to.equal('{"outcome":"single cell","viperScore":0.35,"questions":{"Q1":{"questionId":"Q1","question":"Example question text?","answer":"Yes"}},"reasons":[{"questionId":"Q1","reason":"Example reason text"}]}');
  });

  it('saves the outcome', async function test() {
    const result = await primeDatabase(nomisId, null, null);
    const id = result.id;

    await request(baseUrl).put(`/api/assessments/${id}/outcome`).send({ outcome: 'single cell' }).expect(200);

    await checkThatTheOutcomeDataWasWrittenToDatabase({ id, outcome: 'single cell' });
  });

  it('retrieves a health assessment', async function test() {
    const dbResult = await primeDatabase(nomisId, null, null, 'shared cell');
    const id = dbResult.id;

    const result = await request(baseUrl).get(`/api/assessments/${id}`).expect(200);

    expect(result.body.outcome).to.equal('shared cell');
    expect(result.body.nomisId).to.equal(nomisId);
    expect(result.body.forename).to.equal('assessmentService');
    expect(result.body.surname).to.equal('test');
    expect(result.body).to.have.property('dateOfBirth');
  });
});
