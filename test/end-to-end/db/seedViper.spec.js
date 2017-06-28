import { seedDbWithViperData } from '../../../db/seedUtils';
import db from '../../util/db';

describe.only('#seedUtils', () => {
  describe('.seedDbWithViperData', () => {
    beforeEach(() => db.raw('DELETE FROM viper'));

    afterEach(() => db.raw('DELETE FROM viper'));

    context('given a number of seeds to create', () => {
      it('seeds the database with 0 entries', function test(done) {
        this.timeout(5000);
        seedDbWithViperData(0).then(() => {
          db('viper')
            .count('nomis_id as count')
            .then((result) => {
              expect(result[0].count).to.equal(0);
              done();
            })
            .catch(done);
        });
      });

      it('seeds the database with 1 entries', function test(done) {
        this.timeout(5000);
        seedDbWithViperData(1).then(() => {
          db('viper')
            .count('nomis_id as count')
            .then((result) => {
              expect(result[0].count).to.equal(1);
              done();
            })
            .catch(done);
        });
      });

      it('seeds the database with 1100 entries (testing the batch functionality)', function test(done) {
        this.timeout(8000);
        seedDbWithViperData(1100).then(() => {
          db('viper')
            .count('nomis_id as count')
            .then((result) => {
              expect(result[0].count).to.equal(1100);
              done();
            })
            .catch(done);
        });
      });
    });
  });
});
