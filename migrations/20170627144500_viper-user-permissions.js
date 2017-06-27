// This migration assumes an 'app' user has been created by infrastructure code
// if running locally, you'll need to take care of creating this user

exports.up = knex => knex.raw('GRANT SELECT ON viper TO app');

exports.down = () => Promise.resolve();
