import { extractDecision } from '../../../../client/javascript/services';

describe('#extractDecision', () => {
  it('returns a single cell outcome if there is an exit point', () => {
    expect(extractDecision({ exitPoint: 'foo' })).to.eql({
      recommendation: 'single cell',
      rating: 'high',
    });
  });

  it('returns share cell with conditions if some answers that are part of a group negate the shareCellPredicate', () => {
    const questions = [
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
    ];

    const answers = {
      'foo-section': {
        answer: 'yes',
      },
      'bar-section': {
        answer: 'no',
      },
    };

    expect(extractDecision({ questions, answers })).to.eql({
      recommendation: 'shared cell with conditions',
      rating: 'low',
      reasons: ['foo reason'],
    });
  });

  it('returns share cell if no shareCellPredicate are negated', () => {
    const questions = [
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
    ];

    const answers = {
      'foo-section': {
        answer: 'no',
      },
      'bar-section': {
        answer: 'no',
      },
    };

    expect(extractDecision({ questions, answers })).to.eql({
      recommendation: 'shared cell',
      rating: 'low',
    });
  });
});
