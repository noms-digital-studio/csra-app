import request from 'supertest';
import sinon from 'sinon';
import express from 'express';

import createSearchPrisonerEndpoint from '../../../../server/routes/searchPrisoner';
import { authenticationMiddleware } from '../helpers/mockAuthentication';

const response = [
  {
    bookingId: 49385,
    offenderNo: 'A1464AE',
    firstName: 'JULIAN',
    middleName: null,
    lastName: 'VIGO',
    dateOfBirth: '1974-05-01',
    facialImageId: null,
  },
];

describe('GET /bookings?query', () => {
  let app;

  beforeEach(() => {
    app = express();
  });

  it('returns a offenders for a given search query', () => {
    const fakeSearchPrisonerService = () => ({
      findPrisonersMatching() {
        return sinon.stub().resolves(response)();
      },
    });

    const expected = [
      {
        bookingId: 49385,
        offenderNo: 'A1464AE',
        firstName: 'JULIAN',
        middleName: null,
        lastName: 'VIGO',
        dateOfBirth: '1974-05-01',
        facialImageId: null,
      },
    ];

    app.use('/', createSearchPrisonerEndpoint(fakeSearchPrisonerService, authenticationMiddleware));

    return request(app)
      .get('/')
      .send({
        query: 'A1464AE',
      })
      .expect(200)
      .expect((res) => {
        expect(res.body).to.eql(expected);
      });
  });

  it('returns an empty array if a given search query is invalid', () => {
    const fakeSearchPrisonerService = () => ({
      findPrisonersMatching() {
        return sinon.stub().resolves([])();
      },
    });

    const expected = [];

    app.use('/', createSearchPrisonerEndpoint(fakeSearchPrisonerService, authenticationMiddleware));

    return request(app)
      .get('/')
      .send({
        query: 'A1464AE',
      })
      .expect(200)
      .expect((res) => {
        expect(res.body).to.eql(expected);
      });
  });

  it('returns an empty array if the service errors out', () => {
    const fakeSearchPrisonerService = () => ({
      findPrisonersMatching() {
        return sinon.stub().rejects()();
      },
    });

    app.use('/', createSearchPrisonerEndpoint(fakeSearchPrisonerService, authenticationMiddleware));

    return request(app)
      .get('/')
      .send({
        query: 'A1464AE',
      })
      .expect(200)
      .expect((res) => {
        expect(res.body).to.eql([]);
      });
  });
});
