import debugModule from 'debug';
import xhr from 'xhr';
import not from 'ramda/src/not';
import isEmpty from 'ramda/src/isEmpty';

const debug = debugModule('csra');

const getAssessmentsById = (assessmentId, callback) => {
  const target = `/api/assessments/${assessmentId}`;

  debug('get assessment id %s', assessmentId);

  const options = {
    timeout: 3500,
    json: true,
  };

  xhr.get(target, options, (error, resp, body) => {
    debug('get assessments returned %j', error || body);
    if (error || resp.statusCode >= 400) {
      callback(null);
    } else {
      callback(not(isEmpty(body)) ? body : null);
    }
  });
};

export default getAssessmentsById;
