exports.up = knex =>
  knex.schema.createTableIfNotExists('viper', (table) => {
    table.string('nomis_id', 10).primary();
    table.decimal('rating', 3, 2).notNullable();
  });

exports.down = knex => knex.schema.dropTable('viper');
