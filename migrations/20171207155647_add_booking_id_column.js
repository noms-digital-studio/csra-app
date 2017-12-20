
exports.up = knex => Promise.all([
  knex.schema.table('prisoner_assessments', (table) => {
    table.integer('booking_id').notNullable().defaultTo(-1);
  }),
]);

exports.down = knex => Promise.all([
  knex.schema.table('prisoner_assessments', (table) => {
    table.dropColumn('booking_id');
  }),
]);
