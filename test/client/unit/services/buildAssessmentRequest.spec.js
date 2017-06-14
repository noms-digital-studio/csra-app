import buildAssessmentRequest from '../../../../client/javascript/services/buildAssessmentRequest';

describe('#buildAssessmentRequest', () => {
  it('returns a assessment request for question data with no reasons', () => {
    const questions = [
      {
        section: 'foo-section',
        title: 'foo-question',
      },
      {
        section: 'bar-section',
        title: 'bar-question',
      },
    ];

    const answers = {
      'foo-section': {
        confirmaiton: 'accepted',
      },
      'bar-section': {},
    };

    const request = buildAssessmentRequest('foo-type', {
      nomisId: 'foo-nomis-id',
      outcome: 'Single cell',
      viperScore: 0.71,
      questions,
      answers,
    });

    expect(request).to.eql(
      {
        nomisId: 'foo-nomis-id',
        outcome: 'Single cell',
        type: 'foo-type',
        viperScore: 0.71,
        questions: {
          'bar-section': {
            answer: '',
            question: 'bar-question',
            question_id: 'bar-section',
          },
          'foo-section': {
            answer: '',
            question: 'foo-question',
            question_id: 'foo-section',
          },
        },
        reasons: [],
      });
  });

  it('returns a assessment request for question data with predicate and no reasons', () => {
    const questions = [
      {
        section: 'foo-section',
        title: 'foo-question',
        sharedCellPredicate: {
          type: 'QUESTION',
          value: 'no',
          dependents: ['foo-section'],
          reasons: [],
        },
      },
    ];

    const answers = {
      'foo-section': {
        answer: 'yes',
      },
    };

    const request = buildAssessmentRequest('footype', {
      nomisId: 'foo-nomis-id',
      outcome: 'Single cell',
      viperScore: 0.11,
      questions,
      answers,
    });

    expect(request).to.eql(
      {
        nomisId: 'foo-nomis-id',
        outcome: 'Single cell',
        type: 'footype',
        viperScore: 0.11,
        questions: {
          'foo-section': {
            answer: 'yes',
            question: 'foo-question',
            question_id: 'foo-section',
          },
        },
        reasons: [],
      });
  });

  it('returns a assessment request for a full journey', () => {
    const questions = [
      {
        section: 'foo-section',
        title: 'foo-question',
        sharedCellPredicate: {
          type: 'QUESTION',
          value: 'no',
          dependents: ['foo-section', 'bar-section'],
          reasons: ['foo reason'],
        },
      },
      {
        section: 'bar-section',
        title: 'bar-question',
        sharedCellPredicate: {
          type: 'QUESTION',
          value: 'no',
          dependents: ['foo-section', 'bar-section'],
          reasons: ['bar reason'],
        },
      },
      {
        section: 'baz-section',
        title: 'baz-question',
      },
    ];

    const answers = {
      'foo-section': {
        answer: 'yes',
        'reasons-yes': 'foo-comment',
      },
      'bar-section': {
        answer: 'no',
      },
      'baz-section': {
        comments: 'a baz comment',
      },
    };

    const request = buildAssessmentRequest('footype', {
      nomisId: 'foo-nomis-id',
      outcome: 'Shared cell',
      viperScore: 0.11,
      questions,
      answers,
    });

    expect(request).to.eql(
      {
        nomisId: 'foo-nomis-id',
        outcome: 'Shared cell',
        type: 'footype',
        viperScore: 0.11,
        questions: {
          'foo-section': {
            question_id: 'foo-section',
            question: 'foo-question',
            answer: 'yes',
            comments: 'foo-comment',
          },
          'bar-section': {
            question_id: 'bar-section',
            question: 'bar-question',
            answer: 'no',
          },
          'baz-section': {
            question_id: 'baz-section',
            question: 'baz-question',
            answer: 'a baz comment',
          },
        },
        reasons: [
          {
            question_id: 'foo-section',
            reason: 'foo reason',
          },
        ],
      });
  });
})
;
