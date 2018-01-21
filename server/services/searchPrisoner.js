const { logger: log } = require('./logger');
const { decoratePrisonersWithImages } = require('./prisoner-images');

const { elite2GetRequest } = require('./elite2-api-request');

const valueOrNull = value => value || null;

const parseSearchRequest = bookings =>
  bookings.map(booking => ({
    bookingId: valueOrNull(booking.bookingId),
    offenderNo: valueOrNull(booking.offenderNo),
    firstName: valueOrNull(booking.firstName),
    middleName: valueOrNull(booking.middleName),
    lastName: valueOrNull(booking.lastName),
    dateOfBirth: valueOrNull(booking.dateOfBirth),
    facialImageId: valueOrNull(booking.facialImageId),
  }));

const findPrisoners =
  authToken =>
    async (searchQuery) => {
      try {
        const result = await elite2GetRequest({
          authToken, requestPath: `search-offenders/_/${searchQuery}`,
        });

        return await decoratePrisonersWithImages({
          authToken,
          prisoners: parseSearchRequest(result.body),
        });
      } catch (exception) {
        log.error(`Search failed on Elite 2 failed for [${searchQuery}] with exception:`);
        log.error(exception);

        return [];
      }
    };

const createOffenderSearchService = authToken => ({
  findPrisonersMatching: findPrisoners(authToken),
});

module.exports = createOffenderSearchService;
