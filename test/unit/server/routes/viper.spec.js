import request from 'supertest';
import sinon from 'sinon';
import express from 'express';
import createViperEndpoint from '../../../../server/routes/viper';

describe('GET /viper/:nomisId', () => {
  let app;
  let fakeViperService;

  beforeEach(() => {
    app = express();
    fakeViperService = sinon.stub();
    app.use('/:nomisId', createViperEndpoint(fakeViperService));
  });

  it('responds with status OK (200) and the payload when a rating is found', () => {
    fakeViperService.rating = sinon.stub().resolves(0.45);

    return request(app)
      .get('/viper/A123')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect((res) => {
        expect(res.body).to.eql({ nomisId: 'A123', viperRating: 0.45 });
      });
  });

  it('responds with status OK (404) and an error message when a rating is not found', () => {
    fakeViperService.rating = sinon.stub().rejects(new Error('Some strange viperService error'));

    return request(app)
      .get('/viper/A123')
      .expect('Content-Type', /json/)
      .expect(404)
      .expect((res) => {
        expect(res.body).to.eql({ messasge: 'Error retrieving viper rating for nomisId: A123. The cause was: Error: Some strange viperService error' });
      });
  });
});
