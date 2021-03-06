import { extractDecision } from '../../../../client/javascript/services';

const questions = [
  {
    section: 'risk-of-violence',
    sharedCellPredicate: {
      type: 'VIPER_SCORE',
      value: 'low',
      reasons: ['has a high viper score'],
    },
  },
  {
    section: 'foo-section',
    sharedCellPredicate: {
      type: 'QUESTION',
      value: 'no',
      dependents: ['foo-section', 'bar-section'],
      reasons: ['foo reason'],
    },
  },
  {
    section: 'bar-section',
    sharedCellPredicate: {
      type: 'QUESTION',
      value: 'no',
      dependents: ['foo-section', 'bar-section'],
      reasons: ['bar reason'],
    },
  },
  {
    section: 'baz-section',
    sharedCellPredicate: {
      type: 'QUESTION',
      value: 'no',
      dependents: ['baz-section'],
      reasons: ['baz reason'],
    },
  },
];

describe('#extractDecision', () => {
  context('Given the assessment is completed', () => {
    context('When I computed the assessment outcome', () => {
      context('And no answers negate any shareCellPredicate', () => {
        it('returns a "shared cell" outcome', () => {
          const answers = {
            'foo-section': {
              answer: 'no',
            },
            'bar-section': {
              answer: 'no',
            },
            'baz-section': {
              answer: 'no',
            },
          };

          expect(extractDecision({ questions, answers })).to.eql({
            recommendation: 'shared cell',
            rating: 'standard',
            reasons: [],
          });
        });
      });

      context('And some dependent answers negate shareCellPredicates ', () => {
        it('returns a "shared cell with conditions" outcome with reasons', () => {
          const answers = {
            'foo-section': {
              answer: 'yes',
            },
            'bar-section': {
              answer: 'no',
            },
            'baz-section': {
              answer: 'no',
            },
          };

          expect(extractDecision({ questions, answers })).to.eql({
            recommendation: 'shared cell with conditions',
            rating: 'standard',
            reasons: [{ questionId: 'foo-section', reason: 'foo reason' }],
          });
        });
      });

      context('And no answers negate any shareCellPredicate', () => {
        it('returns a "single cell" outcome', () => {
          const answers = {
            'foo-section': {
              answer: 'no',
            },
            'bar-section': {
              answer: 'no',
            },
            'baz-section': {
              answer: 'yes',
            },
          };

          expect(extractDecision({ questions, answers })).to.eql({
            recommendation: 'single cell',
            rating: 'high',
            reasons: [{ questionId: 'baz-section', reason: 'baz reason' }],
          });
        });
      });

      context('And the viper score is high', () => {
        const viperScore = 0.9;

        context('And no answers negate any shareCellPredicate', () => {
          it('returns  a "single cell" outcome', () => {
            const answers = {
              'risk-of-violence': {
                answer: '',
              },
              'foo-section': {
                answer: 'no',
              },
              'bar-section': {
                answer: 'no',
              },
              'baz-section': {
                answer: 'no',
              },
            };

            expect(extractDecision({ questions, answers, viperScore })).to.eql({
              recommendation: 'single cell',
              rating: 'high',
              reasons: [{ questionId: 'risk-of-violence', reason: 'has a high viper score' }],
            });
          });
        });

        context('And some answers negate shareCellPredicates', () => {
          it('returns a "single cell" outcome with reasons', () => {
            const answers = {
              'risk-of-violence': {
                answer: '',
              },
              'foo-section': {
                answer: 'yes',
              },
              'bar-section': {
                answer: 'no',
              },
              'baz-section': {
                answer: 'no',
              },
            };

            expect(extractDecision({ questions, answers, viperScore })).to.eql({
              recommendation: 'single cell',
              rating: 'high',
              reasons: [
                { questionId: 'risk-of-violence', reason: 'has a high viper score' },
                { questionId: 'foo-section', reason: 'foo reason' },
              ],
            });
          });
        });

        context('And all answers negate shareCellPredicates', () => {
          it('returns a "single cell" outcome with reasons', () => {
            const answers = {
              'risk-of-violence': {
                answer: '',
              },
              'foo-section': {
                answer: 'yes',
              },
              'bar-section': {
                answer: 'yes',
              },
              'baz-section': {
                answer: 'yes',
              },
            };

            expect(extractDecision({ questions, answers, viperScore })).to.eql({
              recommendation: 'single cell',
              rating: 'high',
              reasons: [
                { questionId: 'risk-of-violence', reason: 'has a high viper score' },
                { questionId: 'foo-section', reason: 'foo reason' },
                { questionId: 'bar-section', reason: 'bar reason' },
                { questionId: 'baz-section', reason: 'baz reason' },
              ],
            });
          });
        });
      });
    });
  });
});
