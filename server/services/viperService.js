function ratingFor(db, nomisId) {
  return db
    .select()
    .table('viper')
    .where('nomis_id', nomisId)
    .then((result) => {
      if (result[0]) {
        return result[0].rating;
      }

      return null;
    });
}

export default function createViperService(db) {
  return { rating: nomisId => ratingFor(db, nomisId) };
}
