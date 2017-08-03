import debugModule from 'debug';
import xhr from 'xhr';
import isEmpty from 'ramda/src/isEmpty';

const debug = debugModule('csra');

const getAssessments = (callback) => {
  const target = '/api/assessments';

  debug('get assessments');

  const options = {
    timeout: 3500,
    json: true,
  };

  xhr.get(target, options, (error, resp, body) => {
    debug('get assessments returned %j', error || body);
    if (error) {
      callback(null);
    } else {
      callback(isEmpty(body) ? body : null);
    }
  });
};

export default getAssessments;
