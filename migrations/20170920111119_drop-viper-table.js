exports.up = knex =>
  knex.schema.dropTableIfExists('viper');

exports.down = knex =>
  knex.schema.createTableIfNotExists('viper', (table) => {
    table.string('nomis_id', 10).primary();
    table.decimal('rating', 3, 2).notNullable();
  });
