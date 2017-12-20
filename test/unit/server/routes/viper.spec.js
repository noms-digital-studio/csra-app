import request from 'supertest';
import sinon from 'sinon';
import express from 'express';
import createViperEndpoint from '../../../../server/routes/viper';
import { authenticationMiddleware } from '../helpers/mockAuthentication';

describe('GET /viper/:nomisId', () => {
  let app;
  let fakeViperService;

  before(() => {
    app = express();
    fakeViperService = sinon.stub();
    app.use('/:nomisId', createViperEndpoint(fakeViperService, authenticationMiddleware));
  });

  it('responds with status OK (200) and the payload when a rating is found', () => {
    fakeViperService.rating = sinon.stub().resolves(0.45);

    return request(app)
      .get('/viper/A123')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).to.eql({ nomisId: 'A123', viperRating: 0.45 });
      });
  });

  it('responds with status not found (404) and an error message when a rating is not found', () => {
    fakeViperService.rating = sinon.stub().resolves(null);

    return request(app)
      .get('/viper/A123')
      .expect(404)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).to.eql({ messasge: 'Error retrieving viper rating for nomisId: A123. The cause was: Not found' });
      });
  });

  it('responds with status not found (404) and an error message when an error occurs', () => {
    fakeViperService.rating = sinon.stub().rejects(new Error('Some strange viperService error'));

    return request(app)
      .get('/viper/A123')
      .expect(404)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).to.eql({ messasge: 'Error retrieving viper rating for nomisId: A123. The cause was: Error: Some strange viperService error' });
      });
  });
});
