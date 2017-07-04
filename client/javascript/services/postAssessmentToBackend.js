import superagent from 'superagent';

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
      callback(null);
    } else {
      callback(res.body.data.id);
    }
  });
};

export default postAssessmentToBackend;
