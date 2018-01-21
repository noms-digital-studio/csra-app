import request from 'supertest';
import sinon from 'sinon';
import express from 'express';
import createPrisonerAssessmentsEndpoint from '../../../../server/routes/assessments';
import { authenticationMiddleware } from '../helpers/mockAuthentication';

const app = express();
const fakePrisonerAssessmentsService = sinon.stub();

app.use(createPrisonerAssessmentsEndpoint(
  fakePrisonerAssessmentsService,
  authenticationMiddleware,
));

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

describe('PUT /assessements/:id/risk', () => {
  it('Returns OK (200) when the prisoner assessment is updated with the risk assessment data', () => {
    fakePrisonerAssessmentsService.saveRiskAssessment = sinon.stub().resolves();

    return request(app)
      .put('/123/risk')
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
      .put('/123/risk')
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
      .put('/123/risk')
      .send({
        riskAssessment: { someKey: 'some valid data' },
      })
      .expect(404)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).to.eql({ status: 'NOT FOUND', message: 'Assessment not found' });
      });
  });

  it('responds with status CONFLICT (409) and an error message when the service indicates that the data already exists', () => {
    const err = new Error('Assessment already present');
    err.type = 'conflict';
    fakePrisonerAssessmentsService.saveRiskAssessment = sinon.stub().rejects(err);

    return request(app)
      .put('/123/risk')
      .send({
        riskAssessment: { someKey: 'some good data' },
      })
      .expect(409)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).to.eql({ status: 'CONFLICT', message: 'Assessment already present' });
      });
  });


  it('responds with status SERVER ERROR (500) and an error message when the service is unable to save the data', () => {
    fakePrisonerAssessmentsService.saveRiskAssessment = sinon.stub().rejects(new Error('Terrible database error'));

    return request(app)
      .put('/123/risk')
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

    fakePrisonerAssessmentsService.riskAssessmentFor = sinon.stub().resolves(riskAssessment);

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
    fakePrisonerAssessmentsService.riskAssessmentFor = sinon.stub().rejects(err);

    return request(app)
      .get('/123/risk')
      .expect(404)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).to.eql({ status: 'NOT FOUND', message: 'Assessment not found' });
      });
  });

  it('responds with status OK (500) and an error message when the service is unable to fetch the data ', () => {
    fakePrisonerAssessmentsService.riskAssessmentFor = sinon.stub().rejects(new Error('Terrible database error'));

    return request(app)
      .get('/123/risk')
      .expect(500)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).to.eql({ status: 'ERROR', message: 'Terrible database error' });
      });
  });
});

describe('PUT /assessements/:id/health', () => {
  it('Returns OK (200) when the prisoner assessment is updated with the health assessment data', () => {
    fakePrisonerAssessmentsService.saveHealthAssessment = sinon.stub().resolves();

    return request(app)
      .put('/123/health')
      .send({
        healthAssessment: { someKey: 'some valid data' },
      })
      .expect(200)
      .expect('Content-Type', /json/);
  });

  it('responds with status BAD REQUEST (400) and an error message when the service indicates an validation error', () => {
    const err = new Error('Foo was not valid');
    err.type = 'validation';
    fakePrisonerAssessmentsService.saveHealthAssessment = sinon.stub().rejects(err);

    return request(app)
      .put('/123/health')
      .send({
        healthAssessment: { someKey: 'some bad data' },
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
    fakePrisonerAssessmentsService.saveHealthAssessment = sinon.stub().rejects(err);

    return request(app)
      .put('/123/health')
      .send({
        healthAssessment: { someKey: 'some valid data' },
      })
      .expect(404)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).to.eql({ status: 'NOT FOUND', message: 'Assessment not found' });
      });
  });

  it('responds with status CONFLICT (409) and an error message when the service indicates that the data already exists', () => {
    const err = new Error('Assessment already present');
    err.type = 'conflict';
    fakePrisonerAssessmentsService.saveHealthAssessment = sinon.stub().rejects(err);

    return request(app)
      .put('/123/health')
      .send({
        healthAssessment: { someKey: 'some good data' },
      })
      .expect(409)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).to.eql({ status: 'CONFLICT', message: 'Assessment already present' });
      });
  });

  it('responds with status SERVER ERROR (500) and an error message when the service is unable to save the data', () => {
    fakePrisonerAssessmentsService.saveHealthAssessment = sinon.stub().rejects(new Error('Terrible database error'));

    return request(app)
      .put('/123/health')
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

describe('GET /assessements/:id/health', () => {
  it('responds with status OK (200) and the health assessment', () => {
    const healthAssessment = {
      healthAssessment: { someKey: 'some valid data' },
    };

    fakePrisonerAssessmentsService.healthAssessmentFor = sinon.stub().resolves(healthAssessment);

    return request(app)
      .get('/:id/health')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).to.eql(healthAssessment);
      });
  });

  it('responds with status NOT FOUND (404) and an error message when the assessment id cannot be found', () => {
    const err = new Error('Assessment not found');
    err.type = 'not-found';
    fakePrisonerAssessmentsService.healthAssessmentFor = sinon.stub().rejects(err);

    return request(app)
      .get('/123/health')
      .expect(404)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).to.eql({ status: 'NOT FOUND', message: 'Assessment not found' });
      });
  });

  it('responds with status OK (500) and an error message when the service is unable to fetch the data ', () => {
    fakePrisonerAssessmentsService.healthAssessmentFor = sinon.stub().rejects(new Error('Terrible database error'));

    return request(app)
      .get('/123/health')
      .expect(500)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).to.eql({ status: 'ERROR', message: 'Terrible database error' });
      });
  });

  describe('GET /assessements/:id', () => {
    it('responds with status OK (200) and the assessment', () => {
      const assessment = {
        id: 123,
        createdAt: '2017-07-28T11:54:23.576Z',
        updatedAt: '2017-07-28T11:54:23.576Z',
        nomisId: 'J1234LO',
        forename: 'John',
        surname: 'Lowe',
        dateOfBirth: '14-07-1967',
        outcome: 'Shared Cell',
        riskAssessment: { someKey: 'some valid data' },
        healthAssessment: { someKey: 'some valid data' },
        image: 'some-base64-string',
      };

      fakePrisonerAssessmentsService.assessmentFor = sinon.stub().resolves(assessment);

      return request(app)
        .get('/:id')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body).to.eql(assessment);
        });
    });

    it('responds with status NOT FOUND (404) and an error message when the assessment id cannot be found', () => {
      const err = new Error('Assessment not found');
      err.type = 'not-found';
      fakePrisonerAssessmentsService.assessmentFor = sinon.stub().rejects(err);

      return request(app)
        .get('/123')
        .expect(404)
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body).to.eql({ status: 'NOT FOUND', message: 'Assessment not found' });
        });
    });

    it('responds with status OK (500) and an error message when the service is unable to fetch the data ', () => {
      fakePrisonerAssessmentsService.assessmentFor = sinon.stub().rejects(new Error('Terrible database error'));

      return request(app)
        .get('/123')
        .expect(500)
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body).to.eql({ status: 'ERROR', message: 'Terrible database error' });
        });
    });
  });
});

describe('PUT /assessements/:id/outcome', () => {
  it('Returns OK (200) when the prisoner assessment is updated with the outcome', () => {
    fakePrisonerAssessmentsService.saveOutcome = sinon.stub().resolves();

    return request(app)
      .put('/123/outcome')
      .send({
        outcome: 'single cell',
      })
      .expect(200)
      .expect('Content-Type', /json/);
  });

  it('responds with status BAD REQUEST (400) and an error message when the service indicates an validation error', () => {
    const err = new Error('Foo was not valid');
    err.type = 'validation';
    fakePrisonerAssessmentsService.saveOutcome = sinon.stub().rejects(err);

    return request(app)
      .put('/123/outcome')
      .send({
        outcome: 'bad data',
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
    fakePrisonerAssessmentsService.saveOutcome = sinon.stub().rejects(err);

    return request(app)
      .put('/123/outcome')
      .send({
        outcome: 'some valid data',
      })
      .expect(404)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).to.eql({ status: 'NOT FOUND', message: 'Assessment not found' });
      });
  });

  it('responds with status SERVER ERROR (500) and an error message when the service is unable to save the data', () => {
    fakePrisonerAssessmentsService.saveOutcome = sinon.stub().rejects(new Error('Terrible database error'));

    return request(app)
      .put('/123/outcome')
      .send({
        outcome: 'some valid data',
      })
      .expect(500)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).to.eql({ status: 'ERROR', message: 'Terrible database error' });
      });
  });
});
