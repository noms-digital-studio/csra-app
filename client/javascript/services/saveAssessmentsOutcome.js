import debugModule from 'debug';

import xhr from 'xhr';

const debug = debugModule('csra');


const saveAssessmentOutcome = ({ outcome, assessmentId }, callback) => {
  const target = `/api/assessments/${assessmentId}/outcome`;
  const options = {
    json: { outcome },
    timeout: 3500,
  };

  debug('posting assessment outcome for %s', assessmentId);

  xhr.put(target, options, (error, resp, body) => {
    debug('posted assessment for %s got %j', assessmentId, error || body);

    if (error || resp.statusCode > 400) {
      callback(null);
    } else {
      callback({ status: 'ok' });
    }
  });
};

export default saveAssessmentOutcome;
