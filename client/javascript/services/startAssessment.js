import debugModule from 'debug';
import xhr from 'xhr';
import path from 'ramda/src/path';


const debug = debugModule('csra');

const startAssessment = (prisoner, callback) => {
  debug('posting assessment for %s', prisoner.nomisId);

  const target = '/api/assessments';
  const options = {
    json: prisoner,
    timeout: 3500,
  };

  xhr.post(target, options, (error, resp, body) => {
    debug('posted assessment for %s got %j', prisoner.nomisId, error || body);
    if (error || resp.statusCode >= 400) {
      callback(null);
    } else {
      callback(path(['id'], body) || null);
    }
  });
};

export default startAssessment;
