exports.up = knex => Promise.all([
  knex.schema.table('assessments', (table) => {
    table.decimal('viper', 3, 2);
  }),
  knex('assessments').update('viper', 0),
  knex.schema.table('assessments', (table) => {
    table.decimal('viper', 3, 2).notNull().alter();
  }),
]);

exports.down = knex => knex.schema.table('assessments', (table) => {
  table.dropColumn('viper');
});
