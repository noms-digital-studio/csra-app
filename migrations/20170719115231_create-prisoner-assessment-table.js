exports.up = knex =>
  knex.schema.createTableIfNotExists('prisoner_assessments', (table) => {
    table.increments('id').primary();
    table.timestamps(true, true);
    table.string('nomis_id', 10);
    table.string('forename', 100).notNullable();
    table.string('surname', 100).notNullable();
    table.dateTime('date_of_birth').notNullable();
    table.string('outcome', 50);
    table.text('risk_assessment');
    table.text('health_assessment');
    table.string('questions_hash', 200).notNullable();
    table.string('git_version', 40).notNullable();
    table.dateTime('git_date').notNullable();
  });

exports.down = knex => knex.schema.dropTable('prisoner_assessments');
