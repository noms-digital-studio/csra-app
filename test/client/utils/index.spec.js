import { allFormFieldsComplete, addUniqElementToList } from '../../../client/javascript/utils';

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
});
