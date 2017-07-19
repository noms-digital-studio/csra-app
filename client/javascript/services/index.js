import debugModule from 'debug';

import not from 'ramda/src/not';
import has from 'ramda/src/has';
import is from 'ramda/src/is';
import allPass from 'ramda/src/allPass';
import xhr from 'xhr';

import defaultViperScores from '../fixtures/viper.json';
import defaultOffenderProfiles from '../fixtures/nomis.json';

const debug = debugModule('csra');

export const calculateRiskFor = (nomisId, riskScores = []) => {
  const LOW_RISK_THRESHOLD = 0.59;
  const offenderRiskScore = riskScores.find(
    offender => offender.nomisId === nomisId,
  );

  if (not(offenderRiskScore)) return 'unknown';

  const { viperScore } = offenderRiskScore;

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

export const assessmentCanContinue = (question, answers, viperScore) => {
  if (question.sharedCellPredicate === undefined) {
    return true;
  }

  if (question.sharedCellPredicate.type === 'QUESTION') {
    return question.sharedCellPredicate.dependents.some((section) => {
      if (not(answers[section])) return true;

      return answers[section] === question.sharedCellPredicate.value;
    });
  }

  if (question.sharedCellPredicate.type === 'VIPER_SCORE') {
    return (
      viperScore === 'unknown' ||
      viperScore === question.sharedCellPredicate.value
    );
  }

  // eslint-disable-next-line no-console
  console.error(
    `Received an invalid sharedCellPredicate type: ${question.sharedCellPredicate.type}`,
  );
  return false;
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

const extractReasons = (questions, answers) => {
  const questionsWithPredicates = questions.filter(
    question => !!question.sharedCellPredicate,
  );

  const reasons = questionsWithPredicates.reduce((reasonsList, question) => {
    if (not(answers[question.section])) return reasonsList;

    if (answers[question.section].answer === 'yes') {
      return [...reasonsList, ...question.sharedCellPredicate.reasons];
    }

    return reasonsList;
  }, []);

  return reasons;
};

export const extractDecision = ({ questions, answers, exitPoint }) => {
  if (exitPoint) {
    return {
      recommendation: 'single cell',
      rating: 'high',
    };
  }

  const conditions = extractReasons(questions, answers);

  if (conditions.length) {
    return {
      recommendation: 'shared cell with conditions',
      rating: 'low',
      reasons: conditions,
    };
  }

  return {
    recommendation: 'shared cell',
    rating: 'low',
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
  xhr.get(url, { json: true }, (_error, _response, body) => {
    debug('got viper score for %s of %j', nomisId, _error || body);
    callback(validateViperResponse(body));
  });
};
