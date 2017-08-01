import not from 'ramda/src/not';
import isEmpty from 'ramda/src/isEmpty';

const extractReasons = (questions, answers) => {
  const questionsWithPredicates = questions.filter(
    question => !!question.sharedCellPredicate,
  );

  const reasons = questionsWithPredicates.reduce((reasonsList, question) => {
    if (not(answers[question.section])) return reasonsList;

    if (
      answers[question.section].answer === 'yes' &&
      not(isEmpty(question.sharedCellPredicate.reasons))
    ) {
      const reason = {
        questionId: question.section,
        reason: question.sharedCellPredicate.reasons.join('\n'),
      };

      return [...reasonsList, reason];
    }

    return reasonsList;
  }, []);

  return reasons;
};

const buildQuestionAnswers = (questions, answers) =>
  Object.keys(answers).reduce((acc, sectionKey) => {
    const question = questions.find(q => q.section === sectionKey) || {};
    const answer = Object.keys(
      answers[sectionKey],
    ).reduce((answerText, key) => {
      if (key === 'answer') {
        return answers[sectionKey][key];
      }

      if (key === 'comments') {
        return answers[sectionKey][key];
      }

      return answerText;
    }, '');

    const comments = Object.keys(
      answers[sectionKey],
    ).reduce((answerText, key) => {
      if (key.startsWith('reasons')) {
        return { comments: answers[sectionKey][key] };
      }

      return {};
    }, {});

    return {
      ...acc,
      [sectionKey]: {
        questionId: question.section,
        question: question.title,
        answer,
        ...comments,
      },
    };
  }, {});

const buildAssessmentRequest = ({ outcome, viperScore, questions, answers },
) => ({
  outcome,
  viperScore,
  questions: buildQuestionAnswers(questions, answers),
  reasons: extractReasons(questions, answers),
});

export default buildAssessmentRequest;
