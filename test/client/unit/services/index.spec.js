import {
  calculateRiskFor,
  viperScores,
  offenderNomisProfiles,
  clearBrowserStorage,
} from '../../../src/javascript/services';
import localViperScores from '../../../src/javascript/fixtures/viper.json';
import localOffenderProfiles from '../../../src/javascript/fixtures/nomis.json';
import testViperScores from '../fixtures/viperScore.json';
import testOffenderProfiles from '../fixtures/offenderProfiles.json';

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

  describe('#viperScores', () => {
    context('when viperScores are available in browser storage', () => {
      after(() => sessionStorage.clear());

      it('returns viper scores from browser storage', () => {
        const scores = JSON.stringify(testViperScores);

        sessionStorage.setItem('viperScores', scores);

        expect(viperScores()).to.eql(JSON.parse(scores));
      });
    });

    context('when viperScores are unavailable in browser storage', () => {
      it('returns viperScores found in a local json file', () => {
        expect(viperScores()).to.eql(localViperScores);
      });
    });
  });

  describe('#offenderNomisProfiles', () => {
    context('when offenderNomisProfiles is available in browser storage', () => {
      after(() => sessionStorage.clear());

      it('returns offender NOMIS data form browser storage', () => {
        const offenderProfiles = JSON.stringify(testOffenderProfiles);

        sessionStorage.setItem('offenderProfiles', offenderProfiles);

        expect(offenderNomisProfiles()).to.eql(JSON.parse(offenderProfiles));
      });
    });

    context('when offenderNomisProfiles is unavailable in browser storage', () => {
      it('returns offenderNomisProfiles found in a local json file', () => {
        expect(offenderNomisProfiles()).to.eql(localOffenderProfiles);
      });
    });
  });

  describe('#clearBrowserStorage', () => {
    it('clears browser session and local storage', () => {
      sessionStorage.setItem('foo', 'bar');
      localStorage.setItem('sna', 'fu');

      clearBrowserStorage();

      expect(sessionStorage.length).to.eql(0);
      expect(localStorage.length).to.eql(0);
    });
  });
});
