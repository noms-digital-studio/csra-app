import request from 'supertest';
import sinon from 'sinon';
import express from 'express';
import createPrisonerAssessmentsEndpoint from '../../../../server/routes/assessments';

describe('POST /assessements', () => {
  let app;
  let fakePrisonerAssessmentsService;

  beforeEach(() => {
    app = express();
    fakePrisonerAssessmentsService = sinon.stub();
    app.use('/assessments', createPrisonerAssessmentsEndpoint(fakePrisonerAssessmentsService));
  });

  it('responds with status CREATED (201) when the prisoner assessment record was created', () => {
    fakePrisonerAssessmentsService.save = sinon.stub().resolves({ id: 123 });

    return request(app)
      .post('/assessments')
      .send({
        nomisId: 'AS223213',
        forename: 'John',
        surname: 'Lowe',
        date_of_birth: '31 December 1988',
      })
      .expect(201)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).to.eql({ id: 123 });
      });
  });

  it('responds with status BAD REQUEST (400) and an error message when the service indicates an validation error', () => {
    const err = new Error('Foo was not valid');
    err.type = 'validation';
    fakePrisonerAssessmentsService.save = sinon.stub().rejects(err);

    return request(app)
      .post('/assessments')
      .send({
        nomisId: 'AS223213',
        forename: 'John',
        surname: 'Lowe',
        date_of_birth: '31 December 1988',
      })
      .expect(400)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).to.eql({ status: 'VALIDATION ERROR', message: 'Foo was not valid' });
      });
  });

  it('responds with status SERVER ERROR (500) and an error message when the service is unable to save the data', () => {
    fakePrisonerAssessmentsService.save = sinon.stub().rejects(new Error('Terrible database error'));

    return request(app)
      .post('/assessments')
      .send({
        nomisId: 'AS223213',
        forename: 'John',
        surname: 'Lowe',
        date_of_birth: '31 December 1988',
      })
      .expect(500)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).to.eql({ status: 'ERROR', message: 'Terrible database error' });
      });
  });
});

describe('GET /assessements', () => {
  let app;
  let fakePrisonerAssessmentsService;

  beforeEach(() => {
    app = express();
    fakePrisonerAssessmentsService = sinon.stub();
    app.use('/assessments', createPrisonerAssessmentsEndpoint(fakePrisonerAssessmentsService));
  });

  it('responds with status OK (200) and the list of prisoner assessment summaries', () => {
    const assessmentSummaryList = [{
      id: 123,
      nomisId: 'J1234LO',
      forename: 'John',
      surname: 'Lowe',
      dateOfBirth: '14-07-1967',
      outcome: 'Shared Cell',
      riskAssessment: false,
      healthAssessment: false,
    }];
    fakePrisonerAssessmentsService.list = sinon.stub().resolves(assessmentSummaryList);

    return request(app)
      .get('/assessments')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).to.eql(assessmentSummaryList);
      });
  });

  it('responds with status OK (500) and an error message when the service is unable to fetch the data ', () => {
    fakePrisonerAssessmentsService.list = sinon.stub().rejects(new Error('Terrible database error'));

    return request(app)
      .get('/assessments')
      .expect(500)
      .expect('Content-Type', /json/)
    .expect((res) => {
      expect(res.body).to.eql({ status: 'ERROR', message: 'Terrible database error' });
    });
  });
});
