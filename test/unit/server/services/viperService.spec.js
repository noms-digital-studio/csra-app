import createViperService from '../../../../server/services/viperService';

describe('viper service when feature switch configured to use the database', () => {
  let fakeDB;
  let viperService;

  process.env.USE_VIPER_REST_API = false;

  function setup() {
    fakeDB = { raw: x => x };
    fakeDB.select = sinon.stub().returns(fakeDB);
    fakeDB.table = sinon.stub().returns(fakeDB);

    viperService = createViperService(fakeDB);
  }

  describe('selecting a viper rating', () => {
    before(() => setup());

    it('returns a viper rating for a known nomis id', () => {
      fakeDB.where = sinon.stub().resolves([{ nomisId: 'A123', rating: 0.90 }]);

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
