import debugModule from 'debug';
import xhr from 'xhr';

const debug = debugModule('csra');

const searchPrisoner = (query, callback) => {
  debug('Get prisoner for %s', query);

  const target = `/api/search-prisoner?${query}`;
  const options = {
    json: true,
    timeout: 3500,
  };

  xhr.get(target, options, (error, resp, body) => {
    debug('requested for prisoners using %s got %j', query, error || body);
    if (error || resp.statusCode >= 400) {
      callback([]);
    } else {
      callback(body);
    }
  });
};

export default searchPrisoner;
