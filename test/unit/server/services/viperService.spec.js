import nock from 'nock';
import createViperService from '../../../../server/services/viper';
import config from '../../../../server/config';

describe('viper service', () => {
  let fakeDB;
  let viperService;
  let fakeViperRestService;

  beforeEach(() => {
    fakeViperRestService = nock(`${config.viper.url}`);
    viperService = createViperService(fakeDB);
  });


  describe('selecting a viper rating', () => {
    it('returns a viper rating for a known nomis id', () => {
      fakeViperRestService
      .get('/analytics/viper/A123')
      .reply(200, { nomsId: 'A123', viperRating: 0.34 });

      return viperService.rating('A123')
      .then((result) => {
        expect(result).to.equal(0.34);
      });
    });

    it('returns a viper rating of zero for a known nomis id', () => {
      fakeViperRestService
      .get('/analytics/viper/A123')
      .reply(200, { nomsId: 'A123', viperRating: 0 });

      return viperService.rating('A123')
      .then((result) => {
        expect(result).to.equal(0);
      });
    });

    it('returns a viper rating of 1 for a known nomis id', () => {
      fakeViperRestService
      .get('/analytics/viper/A123')
      .reply(200, { nomsId: 'A123', viperRating: 1 });

      return viperService.rating('A123')
      .then((result) => {
        expect(result).to.equal(1);
      });
    });

    it('returns null for an unknown nomis id', () => {
      fakeViperRestService
      .get('/analytics/viper/A123')
      .reply(404, { message: 'Resource Not Found' });

      return viperService.rating('A123')
      .then((result) => {
        expect(result).to.equal(null);
      });
    });
  });

  describe('viper rest service errors', () => {
    it('returns null if it receives a 500 error', () => {
      fakeViperRestService
      .get('/analytics/viper/A123')
      .reply(500, {});

      return viperService.rating('A123')
      .then((result) => {
        expect(result).to.equal(null);
      });
    });

    it('rejects if it receives an invalid body (bad rating)', () => {
      fakeViperRestService
      .get('/analytics/viper/A123')
      .reply(200, { nomsId: 'A123', viperRating: -1 });

      return viperService.rating('A123')
      .catch((error) => {
        expect(error).to.equal('Invalid body: {"nomsId":"A123","viperRating":-1}');
      });
    });

    it('rejects if it receives an invalid body (no rating)', () => {
      fakeViperRestService
      .get('/analytics/viper/A123')
      .reply(200, { nomsId: 'A123', age: 21 });

      return viperService.rating('A123')
      .catch((error) => {
        expect(error).to.equal('Invalid body: {"nomsId":"A123","age":21}');
      });
    });

    it('rejects if it receives an invalid body (no nomsId)', () => {
      fakeViperRestService
      .get('/analytics/viper/A123')
      .reply(200, { id: 'A123', viperRating: 0.99 });

      return viperService.rating('A123')
      .catch((error) => {
        expect(error).to.equal('Invalid body: {"id":"A123","viperRating":0.99}');
      });
    });

    it('rejects if it receives an invalid body (totally wrong)', () => {
      fakeViperRestService
      .get('/analytics/viper/A123')
      .reply(200, '<nomsId>A123</nomsId><viperRating>0.34</viperRating>');

      return viperService.rating('A123')
      .catch((error) => {
        expect(error).to.equal('Invalid body: <nomsId>A123</nomsId><viperRating>0.34</viperRating>');
      });
    });

    it('rejects if it receives an empty body error', () => {
      fakeViperRestService
      .get('/analytics/viper/A123')
      .reply(200);

      return viperService.rating('A123')
      .catch((error) => {
        expect(error).to.equal('Invalid body: ');
      });
    });
  });
});
