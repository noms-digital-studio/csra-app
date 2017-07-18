import {
  allFormFieldsComplete,
  addUniqElementToList,
  parseDate,
  capitalize,
} from '../../../client/javascript/utils';

describe('Utils', () => {
  describe('#allFormFieldsComplete', () => {
    it('returns true if all required fields are not empty', () => {
      const data = { foo: 'bar', bar: 'baz' };
      const requiredFields = ['foo', 'bar'];

      expect(allFormFieldsComplete(data, requiredFields)).to.equal(true);
    });

    it('returns false is if some required field  empty', () => {
      const data = { foo: '', bar: 'baz' };
      const requiredFields = ['foo', 'bar'];

      expect(allFormFieldsComplete(data, requiredFields)).to.equal(false);
    });

    it('returns false if there are no fields in the data', () => {
      const data = {};
      const requiredFields = ['foo', 'bar'];

      expect(allFormFieldsComplete(data, requiredFields)).to.equal(false);
    });

    it('returns true if there are no required fields', () => {
      const data = { foo: '', bar: 'baz' };
      const requiredFields = [];

      expect(allFormFieldsComplete(data, requiredFields)).to.equal(true);
    });
  });

  describe('#addUniqElementToList', () => {
    it('adds an element to a list if its already not in it', () => {
      expect(addUniqElementToList(1, [2])).to.eql([2, 1]);
    });

    it('does not add an element to the list if is already in the list', () => {
      expect(addUniqElementToList(1, [1])).to.eql([1]);
      expect(addUniqElementToList({}, [{}])).to.eql([{}]);
      expect(addUniqElementToList([1], [[1]])).to.eql([[1]]);
    });
  });

  describe('#parseDate', () => {
    it('parse the date to a human readable for format', () => {
      const date = new Date(1496928311510);
      const expected = '8 June 2017';
      expect(parseDate(date)).to.equal(expected);
    });
  });

  describe('#', () => {
    it('capitalizes the first letter of a sentence', () => {
      const text = 'foo bar baz';
      const expected = 'Foo bar baz';

      expect(capitalize(text)).to.equal(expected);
    });
  });
});
