import { isSharedCellOutcome } from '../../../../client/javascript/services/index';

describe('Decision Engine', () => {
  it('ignores invalid sharedCellPredicate type', () => {
    const question = {
      section: 'risk-of-violence',
      sharedCellPredicate: { type: 'FOO', value: 'low' },
    };
    const answers = {};

    expect(isSharedCellOutcome({ question, answers })).to.equal(true);
  });


  context('Single Question Decision', () => {
    it('continues when the is no sharedCellPredicate', () => {
      const question = {
        section: 'introduction',
      };
      const answers = {};

      expect(isSharedCellOutcome({ question, answers })).to.equal(true);
    });

    it('continues when the answer does not satisfy the sharedCellPredicate', () => {
      const question = {
        section: 'foosection',
        sharedCellPredicate: { type: 'QUESTION', value: 'no', dependents: ['foosection'] },
      };
      const answers = {
        foosection: 'no',
      };

      expect(isSharedCellOutcome({ question, answers })).to.equal(true);
    });

    it('does not continues when the answer satisfies the sharedCellPredicate', () => {
      const question = {
        section: 'fooSection',
        sharedCellPredicate: { type: 'QUESTION', value: 'no', dependents: ['fooSection'] },
      };
      const answers = {
        fooSection: { answer: 'yes' },
      };

      expect(isSharedCellOutcome({ question, answers })).to.equal(false);
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
        prejudice: { answer: 'yes' },
        gangs: { answer: 'no' },
        drugs: { answer: 'no' },
      };

      expect(isSharedCellOutcome({ question, answers })).to.equal(true);
    });

    it('continues when the answers to sharedCellPredicate have not been answered yet', () => {
      const question = {
        section: 'prejudice',
        sharedCellPredicate: {
          type: 'QUESTION',
          value: 'no',
          dependents: ['prejudice', 'gangs', 'drugs'],
        },
      };

      const answers = {
        prejudice: { answer: 'yes' },
      };


      expect(isSharedCellOutcome({ question, answers })).to.equal(true);
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
        prejudice: { answer: 'yes' },
        gangs: { answer: 'yes' },
        drugs: { answer: 'yes' },
      };

      expect(isSharedCellOutcome({ question, answers })).to.equal(false);
    });
  });
});
