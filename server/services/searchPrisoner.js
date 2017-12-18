const superagent = require('superagent');
const url = require('url');
const config = require('../config');
const { logger: log } = require('./logger');
const { generateApiGatewayToken } = require('../jwtUtils');
const { decoratePrisonersWithImages } = require('../utils');

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
        const result =
          await superagent
            .get(url.resolve(`${config.elite2.url}`, `search-offenders/_/${searchQuery}`))
            .set('Authorization', `Bearer ${generateApiGatewayToken()}`)
            .set('Elite-Authorization', authToken);

        return await decoratePrisonersWithImages(authToken, parseSearchRequest(result.body));
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
