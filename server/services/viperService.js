
function scoreFor(db, nomisId) {
  return db
    .select()
    .table('viper')
    .where('nomis_id', nomisId)
    .then(result => (result[0].rating));
}

export default function createViperService(db) {
  return { rating: nomisId => scoreFor(db, nomisId) };
}
