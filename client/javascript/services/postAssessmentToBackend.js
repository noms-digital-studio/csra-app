import { post } from 'superagent';

import buildAssessmentRequest from './buildAssessmentRequest';

function postAssessmentToBackend(assessmentType, {
  nomisId,
  outcome,
  viperScore,
  questions,
  answers,
}, callback) {
  const riskAssessmentRequestParams = buildAssessmentRequest(assessmentType, {
    nomisId,
    outcome,
    viperScore,
    questions,
    answers,
  });

  const target = `${window.location.origin}/api/assessment`;
   // eslint-disable-next-line no-console
  console.log('posting test data to endpoint: ', target);
   // eslint-disable-next-line no-console
  console.log('request data is: ',  JSON.stringify(riskAssessmentRequestParams, null, 2),
  );
  post(target, riskAssessmentRequestParams, (err, res) => {
    // eslint-disable-next-line no-console
    console.log('response: ', JSON.stringify(res, null, 2));
    console.log('ID: ', res.body.data.id);
    if (err) {
      // eslint-disable-next-line no-console
      console.log('error: ', err);
      callback(null);
    } else {
      callback(res.body.data.id);
    }
  });
}

export default postAssessmentToBackend;
