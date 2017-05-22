import { assessmentCanContinue } from '../../../../client/javascript/services/index';

describe('Decision Engine', () => {
  it('return false if given an invalid sharedCellPredicate type', () => {
    const question = {
      section: 'risk-of-violence',
      sharedCellPredicate: { type: 'FOO', value: 'low' },
    };
    const answers = {};
    const viperScore = 'high';

    expect(assessmentCanContinue(question, answers, viperScore)).to.equal(false);
  });

  context('Viper score', () => {
    it('does not continue when the viper score is high', () => {
      const question = {
        section: 'risk-of-violence',
        sharedCellPredicate: { type: 'VIPER_SCORE', value: 'low' },
      };
      const answers = {};
      const viperScore = 'high';

      expect(assessmentCanContinue(question, answers, viperScore)).to.equal(false);
    });

    it('continues when the viper score is low', () => {
      const question = {
        section: 'risk-of-violence',
        sharedCellPredicate: { type: 'VIPER_SCORE', value: 'low' },
      };
      const answers = {};
      const viperScore = 'low';

      expect(assessmentCanContinue(question, answers, viperScore)).to.equal(true);
    });

    it('continues when the viper score is unknown', () => {
      const question = {
        section: 'risk-of-violence',
        sharedCellPredicate: { type: 'VIPER_SCORE', value: 'low' },
      };
      const answers = {};
      const viperScore = 'unknown';

      expect(assessmentCanContinue(question, answers, viperScore)).to.equal(true);
    });
  });

  context('Single Question Decision', () => {
    it('continues when the is no sharedCellPredicate', () => {
      const question = {
        section: 'introduction',
      };
      const answers = {};
      const viperScore = undefined;

      expect(assessmentCanContinue(question, answers, viperScore)).to.equal(true);
    });

    it('continues when the answer does not satisfy the sharedCellPredicate', () => {
      const question = {
        section: 'vulnerability',
        sharedCellPredicate: { type: 'QUESTION', value: 'no', dependents: ['vulnerability'] },
      };
      const answers = {
        vulnerability: 'no',
      };
      const viperScore = undefined;

      expect(assessmentCanContinue(question, answers, viperScore)).to.equal(true);
    });

    it('does not continues when the answer satisfies the sharedCellPredicate', () => {
      const question = {
        section: 'vulnerability',
        sharedCellPredicate: { type: 'QUESTION', value: 'no', dependents: ['vulnerability'] },
      };
      const answers = {
        vulnerability: 'yes',
      };
      const viperScore = undefined;

      expect(assessmentCanContinue(question, answers, viperScore)).to.equal(false);
    });
  });

  context('Multi Question Decision', () => {
    it('continues when the answer does not satisfy the sharedCellPredicate', () => {
      const question = {
        section: 'prejudice',
        sharedCellPredicate: {
          type: 'QUESTION',
          value: 'yes',
          dependents: ['prejudice', 'gangs', 'drugs'],
        },
      };

      const answers = {
        prejudice: 'yes',
        gangs: 'no',
        drugs: 'no',
      };

      const viperScore = undefined;

      expect(assessmentCanContinue(question, answers, viperScore)).to.equal(true);
    });

    it('does not continues when the answer satisfies the sharedCellPredicate', () => {
      const question = {
        section: 'prejudice',
        sharedCellPredicate: {
          type: 'QUESTION',
          value: 'no',
          dependents: ['prejudice', 'gangs', 'drugs'],
        },
      };

      const answers = {
        prejudice: 'yes',
        gangs: 'yes',
        drugs: 'yes',
      };

      const viperScore = undefined;

      expect(assessmentCanContinue(question, answers, viperScore)).to.equal(false);
    });
  });
});
