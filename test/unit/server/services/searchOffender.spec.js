import nock from 'nock';
import createSearchOffenderService from '../../../../server/services/searchOffender';
import config from '../../../../server/config';

describe('Prisoner Booking Service', () => {
  let fakeElite2RestService;
  let offenderSearchService;

  beforeEach(() => {
    fakeElite2RestService = nock(config.elite2.url);
    offenderSearchService = createSearchOffenderService('Bearer AAA.BBB.CCC');
  });

  afterEach(() => {
    nock.cleanAll();
  });

  context('when the request is valid', () => {
    it('returns a offenders for a given valid query', () => {
      const expected = [
        {
          bookingId: 49385,
          offenderNo: 'J1234LO',
          firstName: 'JULIAN',
          middleName: null,
          lastName: 'VIGO',
          dateOfBirth: '1974-05-01',
          facialImageId: null,
        },
      ];

      fakeElite2RestService.get('/search-offenders/_/J1234LO').reply(200, [
        {
          bookingId: 49385,
          bookingNo: 'A00067',
          offenderNo: 'J1234LO',
          firstName: 'JULIAN',
          lastName: 'VIGO',
          dateOfBirth: '1974-05-01',
          age: 43,
          agencyId: 'LEI',
          assignedLivingUnitId: 25145,
          assignedLivingUnitDesc: 'H-1-003',
          iepLevel: 'Standard',
          rnum: 1,
          recordCount: 1,
        },
      ]);

      return offenderSearchService.findOffendersMatching('J1234LO').then((response) => {
        expect(response).to.eql(expected);
      });
    });
  });

  context('when request is invalid', () => {
    it('returns an empty list', () => {
      fakeElite2RestService.get('/search-offenders/_/A1464AE').reply(500);

      return offenderSearchService.findOffendersMatching('J1234LO').then((response) => {
        expect(response).to.eql([]);
      });
    });
  });
});
