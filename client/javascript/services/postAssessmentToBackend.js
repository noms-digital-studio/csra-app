import superagent from 'superagent';
import path from 'ramda/src/path';

import buildAssessmentRequest from './buildAssessmentRequest';

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
  const target = `${window.location.origin}/api/assessment`;

  superagent.post(target, riskAssessmentRequestParams, (error, res) => {
    if (error) {
      if (window.appInsights) {
        window.appInsights.trackEvent('Failed to store assessment for:', { nomisId, error });
      }
      callback(null);
    } else {
      callback(path(['body', 'data', 'id'], res) || null);
    }
  });
};

export default postAssessmentToBackend;
