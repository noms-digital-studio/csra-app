import {
  calculateRiskFor,
} from '../../../../client/javascript/services';
import testViperScores from '../fixtures/viperScore.json';

describe('Services', () => {
  describe('#calculateRiskFor', () => {
    it('returns a low risk rating', () => {
      expect(calculateRiskFor('nomisIdForLowRiskPerson1', testViperScores)).to.equal('low');
      expect(calculateRiskFor('nomisIdForLowRiskPerson2', testViperScores)).to.equal('low');
    });

    it('returns a high risk rating', () => {
      expect(calculateRiskFor('nomisIdForHighRiskPerson1', testViperScores)).to.equal('high');
      expect(calculateRiskFor('nomisIdForHighRiskPerson2', testViperScores)).to.equal('high');
    });

    context("when a score doesn't exist for a given nomisId", () => {
      it('returns unknown', () => {
        expect(calculateRiskFor('nomisIdForUnknown', testViperScores)).to.equal('unknown');
      });
    });
  });
});
