import debugModule from 'debug';

import xhr from 'xhr';

import buildAssessmentRequest from './buildAssessmentRequest';

const debug = debugModule('csra');

const buildViperScore = (viperScore) => {
  if (viperScore) {
    return viperScore;
  }

  return -1;
};

const postAssessmentToBackend = ({
  assessmentType,
  assessmentId,
  outcome,
  viperScore,
  questions,
  answers,
  reasons,
}, callback) => {
  const assessmentRequestParams = buildAssessmentRequest({
    outcome,
    ...(assessmentType === 'risk' ? { viperScore: buildViperScore(viperScore) } : {}),
    questions,
    answers,
    reasons,
  });
  const target = `/api/assessments/${assessmentId}/${assessmentType}`;
  const options = {
    json: assessmentRequestParams,
    timeout: 3500,
  };

  debug('posting assessment for %s', assessmentId);

  xhr.put(target, options, (error, resp, body) => {
    debug('posted assessment for %s got %j', assessmentId, error || body);

    if (error || resp.statusCode > 400) {
      callback(null);
    } else {
      callback({ status: 'ok' });
    }
  });
};

export default postAssessmentToBackend;
