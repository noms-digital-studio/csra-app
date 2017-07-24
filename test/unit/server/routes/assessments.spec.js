import request from 'supertest';
import sinon from 'sinon';
import express from 'express';
import createPrisonerAssessmentsEndpoint from '../../../../server/routes/assessments';

const app = express();

const fakePrisonerAssessmentsService = sinon.stub();
app.use(createPrisonerAssessmentsEndpoint(fakePrisonerAssessmentsService));

describe('POST /assessements', () => {
  it('responds with status CREATED (201) when the prisoner assessment record was created', () => {
    fakePrisonerAssessmentsService.save = sinon.stub().resolves({ id: 123 });

    return request(app)
      .post('/')
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
      .post('/')
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
      .post('/')
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
      .get('/')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).to.eql(assessmentSummaryList);
      });
  });

  it('responds with status OK (500) and an error message when the service is unable to fetch the data ', () => {
    fakePrisonerAssessmentsService.list = sinon.stub().rejects(new Error('Terrible database error'));

    return request(app)
      .get('/')
      .expect(500)
      .expect('Content-Type', /json/)
    .expect((res) => {
      expect(res.body).to.eql({ status: 'ERROR', message: 'Terrible database error' });
    });
  });
});

describe('POST /assessements/:id/risk', () => {
  it('Returns OK (200) when the prisoner assessment is updated with the risk assessment data', () => {
    fakePrisonerAssessmentsService.saveRiskAssessment = sinon.stub().resolves();

    return request(app)
    .post('/123/risk')
    .send({
      riskAssessment: { someKey: 'some valid data' },
    })
    .expect(200)
    .expect('Content-Type', /json/);
  });

  it('responds with status BAD REQUEST (400) and an error message when the service indicates an validation error', () => {
    const err = new Error('Foo was not valid');
    err.type = 'validation';
    fakePrisonerAssessmentsService.saveRiskAssessment = sinon.stub().rejects(err);

    return request(app)
    .post('/123/risk')
    .send({
      riskAssessment: { someKey: 'some bad data' },
    })
    .expect(400)
    .expect('Content-Type', /json/)
    .expect((res) => {
      expect(res.body).to.eql({ status: 'VALIDATION ERROR', message: 'Foo was not valid' });
    });
  });

  it('responds with status NOT FOUND (404) and an error message when the assessment id cannot be found', () => {
    const err = new Error('Assessment not found');
    err.type = 'not-found';
    fakePrisonerAssessmentsService.saveRiskAssessment = sinon.stub().rejects(err);

    return request(app)
    .post('/123/risk')
    .send({
      riskAssessment: { someKey: 'some valid data' },
    })
    .expect(404)
    .expect('Content-Type', /json/)
    .expect((res) => {
      expect(res.body).to.eql({ status: 'NOT FOUND', message: 'Assessment not found' });
    });
  });

  it('responds with status SERVER ERROR (500) and an error message when the service is unable to save the data', () => {
    fakePrisonerAssessmentsService.saveRiskAssessment = sinon.stub().rejects(new Error('Terrible database error'));

    return request(app)
    .post('/123/risk')
    .send({
      riskAssessment: { someKey: 'some valid data' },
    })
    .expect(500)
    .expect('Content-Type', /json/)
    .expect((res) => {
      expect(res.body).to.eql({ status: 'ERROR', message: 'Terrible database error' });
    });
  });
});

describe('GET /assessements/:id/risk', () => {
  it('responds with status OK (200) and the risk assessment', () => {
    const riskAssessment = {
      riskAssessment: { someKey: 'some valid data' },
    };

    fakePrisonerAssessmentsService.getRiskAssessmentForId = sinon.stub().resolves(riskAssessment);

    return request(app)
    .get('/:id/risk')
    .expect(200)
    .expect('Content-Type', /json/)
    .expect((res) => {
      expect(res.body).to.eql(riskAssessment);
    });
  });

  it('responds with status NOT FOUND (404) and an error message when the assessment id cannot be found', () => {
    const err = new Error('Assessment not found');
    err.type = 'not-found';
    fakePrisonerAssessmentsService.getRiskAssessmentForId = sinon.stub().rejects(err);

    return request(app)
    .get('/123/risk')
    .expect(404)
    .expect('Content-Type', /json/)
    .expect((res) => {
      expect(res.body).to.eql({ status: 'NOT FOUND', message: 'Assessment not found' });
    });
  });

  it('responds with status OK (500) and an error message when the service is unable to fetch the data ', () => {
    fakePrisonerAssessmentsService.getRiskAssessmentForId = sinon.stub().rejects(new Error('Terrible database error'));

    return request(app)
    .get('/123/risk')
    .expect(500)
    .expect('Content-Type', /json/)
    .expect((res) => {
      expect(res.body).to.eql({ status: 'ERROR', message: 'Terrible database error' });
    });
  });
});
