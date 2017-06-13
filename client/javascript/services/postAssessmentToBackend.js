import { post } from 'superagent';

import buildAssessmentRequest from './buildAssessmentRequest';

function postAssessmentToBackend(assessmentType, {
  nomisId,
  outcome,
  viperScore,
  questions,
  answers,
}) {
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
  console.log(
    'request data is: ',
    JSON.stringify(riskAssessmentRequestParams, null, 2),
  );
  post(target, riskAssessmentRequestParams, (err, res) => {
    // eslint-disable-next-line no-console
    console.log('response: ', JSON.stringify(res, null, 2));
    // eslint-disable-next-line no-console
    console.log('error: ', err);
  });
}

export default postAssessmentToBackend;
