import nock from 'nock';
import createViperService from '../../../../server/services/viper';
import config from '../../../../server/config';

describe('viper service when feature switch configured to use the database', () => {
  let fakeDB;
  let viperService;

  let viperEnabled;
  before(() => {
    viperEnabled = config.viper.enabled;
    config.viper.enabled = false;
  });
  after(() => {
    config.viper.enabled = viperEnabled;
  });

  function setup() {
    fakeDB = { raw: x => x };
    fakeDB.select = sinon.stub().returns(fakeDB);
    fakeDB.table = sinon.stub().returns(fakeDB);

    viperService = createViperService(fakeDB);
  }

  describe('selecting a viper rating', () => {
    before(() => setup());

    it('returns a viper rating for a known nomis id', () => {
      fakeDB.where = sinon.stub().resolves([{ nomis_id: 'A123', rating: 0.90 }]);

      return viperService.rating('A123')
        .then((result) => {
          expect(fakeDB.table.lastCall.args[0]).to.eql('viper');
          expect(fakeDB.where.lastCall.args[0]).to.eql('nomis_id');
          expect(fakeDB.where.lastCall.args[1]).to.eql('A123');
          expect(result).to.equal(0.90);
        });
    });

    it('returns null for an unknown nomis id', () => {
      fakeDB.where = sinon.stub().resolves([]);

      return viperService.rating('A123')
        .then((result) => {
          expect(result).to.equal(null);
        });
    });
  });

  describe('db errors', () => {
    before(() => setup());

    it('passes on the db error', () => {
      fakeDB.where = sinon.stub().rejects(new Error('Connection failed or something'));

      return expect(viperService.rating('A123'))
        .to.be.rejectedWith(Error, 'Connection failed or something');
    });
  });
});

describe('viper service when feature switch configured to use the viper rest service', () => {
  let fakeDB;
  let viperService;
  let fakeViperRestService;
  let viperEnabled;

  before(() => {
    viperEnabled = config.viper.enabled;
    config.viper.enabled = true;
  });

  beforeEach(() => {
    fakeViperRestService = nock(`${config.viper.url}`);
    viperService = createViperService(fakeDB);
  });

  after(() => {
    config.viper.enabled = viperEnabled;
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
