import uuid from 'uuid';

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

const generateViperRows = (iterations) => {
  const viperRows = [];

  // eslint-disable-next-line
  for (let i = 0; i < iterations; i++) {
    viperRows.push(generateViper());
  }

  return viperRows;
};

const createViperData = (iterations) => {
  const chunkSize = 1000;
  const rows = generateViperRows(iterations);

  return db.batchInsert('viper', rows, chunkSize);
};

// eslint-disable-next-line
export const seedDbWithViperData = iterations => createViperData(iterations);
