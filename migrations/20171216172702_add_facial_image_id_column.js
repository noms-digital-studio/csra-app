
exports.up = knex => Promise.all([
  knex.schema.table('prisoner_assessments', (table) => {
    table.integer('facial_image_id').defaultTo(null);
  }),
]);

exports.down = knex => Promise.all([
  knex.schema.table('prisoner_assessments', (table) => {
    table.dropColumn('facial_image_id');
  }),
]);
