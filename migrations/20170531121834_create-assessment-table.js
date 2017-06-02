exports.up = knex =>
knex.schema.createTableIfNotExists('assessments', (table) => {
  table.increments('assessment_id').primary();
  table.dateTime('timestamp').notNullable().defaultTo(knex.fn.now());
  table.string('nomis_id', 10).notNullable();
  table.string('type', 10).notNullable();
  table.string('outcome', 25).notNullable();
  table.string('questions_hash', 40).notNullable();
  table.string('git_version', 40).notNullable();
  table.dateTime('git_date').notNullable();
  table.text('questions').notNullable();
  table.text('reasons').notNullable();
});

exports.down = knex => knex.schema.dropTable('assessments');
