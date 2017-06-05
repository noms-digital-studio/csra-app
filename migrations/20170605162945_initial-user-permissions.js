// This migration assumes an 'app' user has been created by infrastructure code
// if running locally, you'll need to take care of creating this user

exports.up = knex => Promise.all([
  knex.raw('GRANT INSERT TO app'),
  knex.raw('GRANT SELECT ON assessments(assessment_id) TO app'),
]);

exports.down = () => Promise.resolve();
