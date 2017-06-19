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
        question_id: question.section,
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
        question_id: question.section,
        question: question.title,
        answer,
        ...comments,
      },
    };
  }, {});

const buildViperScore = (viperScore) => {
  if (viperScore) {
    return viperScore;
  }

  return -1;
};

const buildAssessmentRequest = (
  assessmentType,
  { nomisId, outcome, viperScore, questions, answers },
) => ({
  nomisId,
  outcome,
  type: assessmentType,
  viperScore: buildViperScore(viperScore),
  questions: buildQuestionAnswers(questions, answers),
  reasons: extractReasons(questions, answers),
});

export default buildAssessmentRequest;
