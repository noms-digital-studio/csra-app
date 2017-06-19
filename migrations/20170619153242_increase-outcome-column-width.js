
exports.up = knex => Promise.all([
  knex.schema.table('assessments', (table) => {
    table.string('outcome', 27).notNullable().alter();
  }),
]);

exports.down = knex => Promise.all([
  knex.schema.table('assessments', (table) => {
    table.string('outcome', 25).notNullable().alter();
  }),
]);
