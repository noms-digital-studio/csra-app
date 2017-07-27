import debugModule from 'debug';

import xhr from 'xhr';
import path from 'ramda/src/path';

import buildAssessmentRequest from './buildAssessmentRequest';

const debug = debugModule('csra');

const postAssessmentToBackend = (assessmentType, {
  nomisId,
  outcome,
  viperScore,
  questions,
  answers,
  reasons,
}, callback) => {
  const riskAssessmentRequestParams = buildAssessmentRequest(assessmentType, {
    nomisId,
    outcome,
    viperScore,
    questions,
    answers,
    reasons,
  });
  // const target = `${window.location.origin}/api/assessment`;
  const target = '/api/assessment';

  debug('posting assessment for %s', nomisId);
  const options = {
    json: riskAssessmentRequestParams,
    timeout: 3500,
  };
  xhr.post(target, options, (error, resp, body) => {
    debug('posted assessment for %s got %j', nomisId, error || body);
    if (error) {
      callback(null);
    } else {
      callback(path(['data', 'id'], body) || null);
    }
  });
};

export default postAssessmentToBackend;
