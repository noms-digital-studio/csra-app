/* eslint-disable no-console */
import fs from 'fs';
import createDBConnectionPool from '../server/db';

const BATCH_SIZE = 1000;

function unpackQuotedString(str) {
  return str.slice(1, -1);
}

const data = fs.readFileSync(process.argv[2], 'utf8')
  .split('\n')
  .filter(Boolean)
  .map((row) => {
    const rowData = row.split(',');
    return {
      nomis_id: unpackQuotedString(rowData[0]),
      rating: parseFloat(rowData[1]),
    };
  });

const db = createDBConnectionPool();

// Give some idea of progress
let i = 0;
const total = data.length;
db.on('query', () => {
  i += 1;
  console.log(
    '%s Inserting %d/%d',
    new Date().toISOString(), i * BATCH_SIZE, total,
  );
});

db.batchInsert('viper', data, BATCH_SIZE)
  .then(() => {
    console.log('done');
    return db.destroy();
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
