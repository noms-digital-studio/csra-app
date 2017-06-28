import uuid from 'uuid';
import flatten from 'ramda/src/flatten';
import times from 'ramda/src/times';

import createDBConnectionPool from '../server/db';

const db = createDBConnectionPool();

const generateValueBetween = (min, max) =>
  // eslint-disable-next-line
  Number((Math.random() * (max - min) + min).toFixed(2));

const generateViper = () => {
  const nomisId = uuid().substring(0, 10);
  const viperRating = generateValueBetween(0.01, 0.99);
  return {
    nomis_id: nomisId,
    rating: viperRating,
  };
};

const generateViperRows = (iterations, rows = []) => {
  if (iterations === 0) return rows;

  const viperData = generateViper();
  const newRows = [...rows, viperData];
  const iterationsLeft = iterations - 1;

  return generateViperRows(iterationsLeft, newRows);
};

// Done to avoid call stack max size
const divideAndConquerGenerationOfViperRows = (iterations, chunkSize) => {
  const quotient = Math.floor(iterations / chunkSize);
  const reminder = iterations % chunkSize;

  const quotientRows = times(() => generateViperRows(chunkSize), quotient);
  const reminderRows = generateViperRows(reminder);
  const rows = flatten(quotientRows.concat(reminderRows));

  return rows;
};

const createViperData = (iterations) => {
  const chunkSize = 1000;
  const maxIteration = 5000;

  const rows = iterations > maxIteration
    ? divideAndConquerGenerationOfViperRows(iterations, chunkSize)
    : generateViperRows(iterations);

  return db.batchInsert('viper', rows, chunkSize);
};

// eslint-disable-next-line
export const seedDbWithViperData = iterations => createViperData(iterations);
