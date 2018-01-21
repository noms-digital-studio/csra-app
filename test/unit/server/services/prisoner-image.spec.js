import nock from 'nock';
import config from '../../../../server/config';
import { decoratePrisonersWithImages } from '../../../../server/services/prisoner-images';


describe('Prisoner Image Service', () => {
  let fakeElite2RestService;

  beforeEach(() => {
    fakeElite2RestService = nock(`${config.elite2.url}`);
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe('#decoratePrisonersWithImages', () => {
    it('adds images to data when a facialImageId is available', () => {
      const prisoners = [
        { facialImageId: 1, nomisId: 'foo-id' },
        { nomisId: 'bar-id' },
        { facialImageId: 2, nomisId: 'baz-id' },
      ];

      const base64Image = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QBARXhpZgAATU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAAaADAAQAAAABAAAAAQAAAAD/7QA4UGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAAA4QklNBCUAAAAAABDUHYzZjwCyBOmACZjs+EJ+/8AAEQgAAQABAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/bAEMAAgICAgICBAICBAYEBAQGCAYGBgYICggICAgICgwKCgoKCgoMDAwMDAwMDA4ODg4ODhAQEBAQEhISEhISEhISEv/bAEMBAwMDBQQFCAQECBMNCw0TExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTE//dAAQAAf/aAAwDAQACEQMRAD8A/n/ooooA/9k=';

      const expected = [
        { facialImageId: 1, nomisId: 'foo-id', image: base64Image },
        { nomisId: 'bar-id', image: null },
        { facialImageId: 2, nomisId: 'baz-id', image: base64Image },
      ];

      fakeElite2RestService
        .persist()
        .get(/images\/\d\/data/)
        .replyWithFile(200, `${__dirname}/1x1.jpg`);

      return decoratePrisonersWithImages({ authToken: 'foo-auth-token', prisoners })
        .then((result) => {
          expect(result).to.eql(expected);
        });
    });

    context('when there is an error retrieving ', () => {
      it('return prisoners with no images', () => {
        const prisoners = [
          { facialImageId: 1, nomisId: 'foo-id' },
          { nomisId: 'bar-id' },
          { facialImageId: 2, nomisId: 'baz-id' },
        ];

        const expected = [
          { facialImageId: 1, nomisId: 'foo-id', image: null },
          { nomisId: 'bar-id', image: null },
          { facialImageId: 2, nomisId: 'baz-id', image: null },
        ];

        fakeElite2RestService
          .persist()
          .get(/images\/\d\/data/)
          .reply(500, 'Internal server error');

        return decoratePrisonersWithImages({ authToken: 'foo-auth-token', prisoners })
          .then((result) => {
            expect(result).to.eql(expected);
          });
      });
    });
  });
});
