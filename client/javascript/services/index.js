import debugModule from 'debug';

import not from 'ramda/src/not';
import has from 'ramda/src/has';
import is from 'ramda/src/is';
import path from 'ramda/src/path';
import allPass from 'ramda/src/allPass';
import xhr from 'xhr';
import { LOW_RISK_THRESHOLD } from '../constants/common';
import defaultViperScores from '../fixtures/viper.json';
import defaultOffenderProfiles from '../fixtures/nomis.json';

const debug = debugModule('csra');

export const calculateRiskFor = (nomisId, riskScores = []) => {
  const offenderRiskScore = riskScores.find(offender => offender.nomisId === nomisId);

  if (not(offenderRiskScore)) return 'unknown';

  const { viperScore } = offenderRiskScore;

  if (viperScore <= LOW_RISK_THRESHOLD) {
    return 'low';
  }

  return 'high';
};

export const riskFromViperScore = (viperScore) => {
  if (not(viperScore)) return 'unknown';

  if (viperScore <= LOW_RISK_THRESHOLD) {
    return 'low';
  }

  return 'high';
};

export const viperScores = () => {
  if (sessionStorage.getItem('viperScores')) {
    return JSON.parse(sessionStorage.getItem('viperScores'));
  }

  return defaultViperScores;
};

export const readSingleFile = (file, callback) => {
  if (not(file)) return;

  const reader = new FileReader();
  reader.onload = ({ target: { result } }) => {
    callback(null, result);
  };

  reader.onerror = (error) => {
    callback(error.message, null);
  };

  reader.readAsText(file);
};

export const storeData = (key, data) => {
  sessionStorage.setItem(key, data);
};

export const offenderNomisProfiles = () => {
  if (sessionStorage.getItem('offenderProfiles')) {
    return JSON.parse(sessionStorage.getItem('offenderProfiles'));
  }

  return defaultOffenderProfiles;
};

export const clearBrowserStorage = () => {
  sessionStorage.clear();
  localStorage.clear();
};

export const isSharedCellOutcome = ({ question, answers }) => {
  if (question.sharedCellPredicate === undefined) {
    return true;
  }

  if (question.sharedCellPredicate.type === 'QUESTION') {
    return question.sharedCellPredicate.dependents.some((section) => {
      const answer = path([section, 'answer'], answers);

      if (not(answer)) return true;

      return answer === question.sharedCellPredicate.value;
    });
  }

  return true;
};

export const cellAssignment = ({ healthcare, riskAssessment }) => {
  if (healthcare.sharedCell && riskAssessment.sharedCell) {
    if (riskAssessment.conditions) {
      return 'shared cell with conditions';
    }
    return 'shared cell';
  }

  return 'single cell';
};

const extractReasons = ({ questions, answers, viperScore }) => {
  const questionsWithPredicates = questions.filter(question => !!question.sharedCellPredicate);

  const reasons = questionsWithPredicates.reduce((reasonsList, question) => {
    if (not(answers[question.section])) return reasonsList;

    if (answers[question.section].answer === 'yes') {
      const questionReasons = question.sharedCellPredicate.reasons.map(reason => ({
        questionId: question.section,
        reason,
      }));

      return [...reasonsList, ...questionReasons];
    }

    return reasonsList;
  }, []);

  return viperScore > LOW_RISK_THRESHOLD ? ['has a high viper score', ...reasons] : reasons;
};

export const extractDecision = ({ questions, answers, viperScore }) => {
  const reasons = extractReasons({ questions, answers, viperScore });
  const isSingleCell = questions.some(question => not(isSharedCellOutcome({ question, answers })));

  if (viperScore > LOW_RISK_THRESHOLD || isSingleCell) {
    return {
      recommendation: 'single cell',
      rating: 'high',
      reasons,
    };
  }

  if (reasons.length) {
    return {
      recommendation: 'shared cell with conditions',
      rating: 'standard',
      reasons,
    };
  }

  return {
    recommendation: 'shared cell',
    rating: 'standard',
    reasons,
  };
};

const validateViperResponse = (body) => {
  const hasBody = is(Object);
  const hasViperRating = has('viperRating');
  const hasNomisId = has('nomisId');
  const validResponse = allPass([hasBody, hasViperRating, hasNomisId]);

  if (validResponse(body)) {
    return body;
  }

  return null;
};

export const retrieveViperScoreFor = (nomisId, callback) => {
  const url = `/api/viper/${nomisId}`;

  debug('requesting viper score for %s', nomisId);
  xhr.get(url, { json: true, timeout: 3500 }, (_error, _response, body) => {
    debug('got viper score for %s of %j', nomisId, _error || body);
    callback(validateViperResponse(body));
  });
};

export const buildQuestionAnswer = (question, answer) => {
  const section = path(['section'], question);
  const title = path(['title'], question);
  const answerValues = Object.keys(answer).reduce((answerText, key) => {
    if (key === 'confirmation') {
      return answer[key];
    }

    if (key === 'answer') {
      return answer[key];
    }

    if (key === 'comments') {
      return answer[key];
    }

    return answerText;
  }, '');
  const comments = Object.keys(answer).reduce((answerText, key) => {
    if (key.startsWith('reasons')) {
      return { [key]: answer[key] };
    }
    return {};
  }, {});

  return {
    [section]: {
      questionId: section,
      question: title,
      answer: answerValues,
      ...comments,
    },
  };
};
