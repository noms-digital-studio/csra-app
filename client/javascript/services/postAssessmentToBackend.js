import debugModule from 'debug';

import xhr from 'xhr';

const debug = debugModule('csra');

const postAssessmentToBackend = ({
  assessmentType,
  assessmentId,
  assessment,
}, callback) => {
  const target = `/api/assessments/${assessmentId}/${assessmentType}`;
  const options = {
    json: assessment,
    timeout: 3500,
  };

  debug('posting assessment for %s', assessmentId);

  xhr.put(target, options, (error, resp, body) => {
    debug('posted assessment for %s got %j', assessmentId, error || body);

    if (error || resp.statusCode >= 400) {
      callback(null);
    } else {
      callback({ status: 'ok' });
    }
  });
};

export default postAssessmentToBackend;
