import request from 'supertest';
import uuid from 'uuid/v4';
import db from '../../util/db';

const baseUrl = process.env.APP_BASE_URL;

describe('/api/viper', () => {
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
            expect(res.body).to.have.property('nomisId')
              .which.equals(nomisId);
            expect(res.body).to.have.property('viperRating')
              .which.equals(0.42);
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
        expect(res.body).to.have.property('messasge')
          .which.equals(`Error retrieving viper rating for nomisId: ${nomisId}. The cause was: TypeError: Cannot read property 'rating' of undefined`);
        done();
      });
  });
});

