import request from 'supertest';
import uuid from 'uuid/v4';
import db from '../../util/db';

const baseUrl = process.env.APP_BASE_URL;

describe('/api/viper/:nomisId', () => {
  it('returns a viper rating for a known nomis id', function test(done) {
    this.timeout(5000);
    const nomisId = uuid().substring(0, 8);
    db.insert({
      nomis_id: nomisId,
      rating: 0.42,
    })
      .into('viper')
      .then(
        request(baseUrl).get(`/api/viper/${nomisId}`)
          .expect(200)
          .end((err, res) => {
            if (err) done(err);
            expect(res.body).to.eql({ nomisId, viperRating: 0.42 });
            done();
          }),
      );
  });

  it('returns a 404 (not found) for an unknown nomis id', function test(done) {
    this.timeout(5000);
    const nomisId = uuid().substring(0, 8);
    request(baseUrl).get(`/api/viper/${nomisId}`)
      .expect(404)
      .end((err, res) => {
        if (err) done(err);
        expect(res.body).to.eql({ messasge: `Error retrieving viper rating for nomisId: ${nomisId}. The cause was: Not found` });
        done();
      });
  });
});

