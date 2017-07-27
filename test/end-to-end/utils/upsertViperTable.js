import config from '../../../server/config';
import db from '../../util/db';

const upsertViperTableWith = ({ nomisId, viperScore }) => {
  if (config.viper.enabled) {
    return Promise.resolve();
  }
  return db.raw(`IF NOT EXISTS (SELECT * FROM viper WHERE nomis_id = '${nomisId}') INSERT INTO viper VALUES('${nomisId}', ${viperScore}) ELSE UPDATE viper SET rating = ${viperScore} WHERE nomis_id = '${nomisId}'`);
};

export default upsertViperTableWith;
